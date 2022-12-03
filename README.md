
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
# you can use "make dev ENV=prod" to start in production mode
$ make up

# shut them down
# if started in production mode, write "make down ENV=prod"
$ make down

# in any critical event, you can kill the containers
$ make kill
```

### On Windows

TODO