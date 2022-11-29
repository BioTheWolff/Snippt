
up:
	mkdir -p .docker/pgsql/data
	cd .docker && docker compose up -d

down:
	cd .docker && docker compose down

kill:
	cd .docker && docker compose kill