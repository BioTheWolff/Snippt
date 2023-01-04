include .docker/.env

# DOCKER #
up:
	@mkdir -p .docker/pgsql/data
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down:
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.prod.yml down

build:
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.prod.yml build

redeploy: build
	@cd .docker && docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate


# MIGRATE #
migrate: up
	@echo "Replaying migrations..."
	@docker exec --workdir /srv $(COMPOSE_PROJECT_NAME)_api npm run typeorm:run-migrations

up-migrate: up migrate