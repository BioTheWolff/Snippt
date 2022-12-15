include .docker/.env

# the environment variable
ENV ?=dev
command ?=
USER ?= $(shell whoami)

up:
	@echo "------------------------------"
	@echo "Starting in $(ENV) mode"
	@echo "------------------------------"
	@mkdir -p .docker/pgsql/data
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.$(ENV).yml up -d

down:
	@echo "------------------------------"
	@echo "$(ENV) - Shutting down"
	@echo "------------------------------"
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.$(ENV).yml down

kill:
	@echo "------------------------------"
	@echo "$(ENV) - Killing containers"
	@echo "------------------------------"
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.$(ENV).yml kill


migrate: up
	@echo "Replaying migrations..."
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_api npm run typeorm:run-migrations

revert: up
	@echo "Reverting migrations..."
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_api npm run typeorm:revert-migration

typeorm: up
	@echo "Warning: executing raw 'npm run typeorm' command"
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_api npm run typeorm:$(command)

fix-perms:
	@echo "Warning: requires root access"
	@sudo chown -R $(USER):$(USER) ./api/src/database/migrations/
	@echo "Migration files permissions fixed"