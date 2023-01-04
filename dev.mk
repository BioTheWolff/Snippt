include .docker/.env

command ?=
USER ?= $(shell whoami)

# DOCKER #
up:
	@mkdir -p .docker/pgsql/data
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

down:
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.dev.yml down

kill:
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.dev.yml kill


# TYPEORM #
migrate: up
	@echo "Replaying migrations..."
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_dev_api npm run typeorm:run-migrations

revert: up
	@echo "Reverting migrations..."
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_dev_api npm run typeorm:revert-migration

typeorm: up
	@echo "Warning: executing raw 'npm run typeorm' command"
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_dev_api npm run typeorm:$(command)

fix-perms:
	@echo "Warning: requires root access"
	@sudo chown -R $(USER):$(USER) ./api/src/database/migrations/
	@echo "Migration files permissions fixed"