#!/bin/bash
set -eo pipefail  # Exit on error + show logs

TAG=${1:-latest}  # Gets Git commit SHA (or uses "latest")
DOCKER_USER=${DOCKER_HUB_USERNAME}  # Docker Hub username
SERVICE="devops-health-check"  # Your app name
COMPOSE_FILE="/app/docker-compose.prod.yml"  # Path to compose file

echo "🚀 Deploying $SERVICE:$TAG"

# 1. Pull new Docker image
docker pull $DOCKER_USER/$SERVICE:$TAG

# 2. Update services (no downtime)
docker-compose -f $COMPOSE_FILE up -d --no-deps web checker

# 3. Health check (wait for app to start)
echo "🔍 Running health checks..."
./scripts/wait-for-it.sh -t 60 "http://localhost:5000/health"

# 4. Cleanup old Docker images
echo "🧹 Removing old images..."
docker image prune -f

echo "✅ Deployment successful!"