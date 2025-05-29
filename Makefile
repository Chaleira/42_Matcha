# Environment
ENV_FILE=.env
COMPOSE=docker-compose --env-file $(ENV_FILE)
PROJECT_NAME=matcha

# Targets
.PHONY: up down build rebuild logs frontend backend db shell help

# Start all services
up:
	$(COMPOSE) up -d

# Stop all services
down:
	$(COMPOSE) down

restart: down up

reload: down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

# Build all services (frontend build included)
build:
	$(COMPOSE) build

# Rebuild from scratch
rebuild:
	$(COMPOSE) down -v
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

# Logs
logs:
	$(COMPOSE) logs -f

# Access backend container
backend:
	$(COMPOSE) exec backend sh

# Access frontend container
frontend:
	$(COMPOSE) exec frontend sh

# Access database container
db:
	$(COMPOSE) exec db psql -U $$POSTGRES_USER -d $$POSTGRES_DB

# Clean up Docker containers, images, and volumes
clean:
	 docker stop $(docker ps -q) && docker rm $(docker ps -aq) && docker rmi $(docker images -q) && docker system prune -af --volumes

# Help
help:
	@echo "Makefile commands:"
	@echo "  up         Start all services"
	@echo "  down       Stop all services"
	@echo "  build      Build containers"
	@echo "  rebuild    Rebuild everything from scratch"
	@echo "  logs       Tail logs"
	@echo "  backend    Shell into backend container"
	@echo "  frontend   Shell into frontend container"
	@echo "  db         PSQL into database"
