# the environment variable
ENV ?=dev

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