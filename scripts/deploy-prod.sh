#!/bin/bash
set -eo pipefail

TAG=${1:-latest}
DOCKER_USER=${DOCKER_HUB_USERNAME}
SERVICE="devops-health-check"
COMPOSE_FILE="/app/docker-compose.prod.yml"

echo "🚀 Deploying $SERVICE:$TAG"

# 1. Pull new image
docker pull $DOCKER_USER/$SERVICE:$TAG

# 2. Update services
docker-compose -f $COMPOSE_FILE up -d --no-deps web checker

# 3. Verify
echo "🔍 Running health checks..."
./scripts/wait-for-it.sh -t 60 "http://localhost:5000/health"

# 4. Cleanup
echo "🧹 Removing old images..."
docker image prune -f

echo "✅ Deployment successful!"