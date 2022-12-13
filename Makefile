include .docker/.env

# the environment variable
ENV ?=dev
command ?=

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
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_api pwd

api-typeorm-command: up
	@echo "Warning: executing raw 'npm run typeorm' command"
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_api npm run typeorm:$(command)