# Variables
DOCKER_COMPOSE = docker-compose

# Targets
.PHONY: up down build clear

up:
	@$(DOCKER_COMPOSE) up -d

down:
	@$(DOCKER_COMPOSE) down

build:
	@$(DOCKER_COMPOSE) build

clear: down
	@$(DOCKER_COMPOSE) down -v --remove-orphans
	@docker system prune -af
