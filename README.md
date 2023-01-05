
# Snippt

Snippt is a fictional code-snippet-based social network.

## Installation

Clone the project from Github:

```
git clone git@github.com:BioTheWolff/Snippt.git
```

This project is ran using Docker and its new `docker compose` plugin, so make sure you have Docker and the compose plugin installed:
- On Windows, I advise installing Docker Desktop
- On most UNIX systems, installing the `docker` and `docker-compose` packages should suffice (WARNING: names could differ depending on your distribution)

## Running the project

### On UNIX systems

If you have the `make` command available, use the `Makefile` at the root of the project:

```bash
# start the containers
$ make -f prod.mk up

# shut them down
$ make -f prod.mk down

# apply database migrations to the api containers
$ make -f prod.mk migrate

# redeploy the application 
# (rebuild the images then recreate the containers)
$ make -f prod.mk redeploy
```

If you want to contribute to the project, you will want to use the dev environment instead :

```bash
# start the containers
$ make -f dev.mk up

# shut them down
$ make -f dev.mk down

# in any critical event, kill the containers
$ make -f dev.mk kill

# apply database migrations to the api containers
$ make -f dev.mk migrate

# native typeorm commands defined in api/package.json are accessible
# for example here, we generate a new migration
$ make -f dev.mk typeorm command="generate-migration --name=MyMigration"

# as migrations are created with the container's user,
# you will want to fix the migrations folder's permissions
$ make -f dev.mk fix-perms
```

### On Windows

TODO: windows documentation