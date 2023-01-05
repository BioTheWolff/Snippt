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
# we find all the replicas and run the migration command in them
migrate: up
	@echo "Replaying migrations..."
	@for container in $(shell docker ps --format "{{lower .Names}}" | grep "snippt-api") ; do \
		docker exec --workdir /srv $$container npm run typeorm:run-migrations > /dev/null ; \
	done

up-migrate: up migrate