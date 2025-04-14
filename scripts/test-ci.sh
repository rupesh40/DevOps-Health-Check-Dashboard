#!/bin/bash
set -euo pipefail

: "${TAG:=test}"
: "${DOCKER_HUB_USERNAME:=local}"

echo "🚀 Starting test pipeline..."
echo "Docker: $(docker --version)"
echo "Compose: $(docker compose version)"

# Clean previous containers
docker compose -f docker/dev/docker-compose.yml down -v

echo "🔨 Building test image..."
docker compose -f docker/dev/docker-compose.yml build web

echo "🧪 Running tests..."
time docker compose -f docker/dev/docker-compose.yml run --rm \
  web sh -c "ls -la tests/ && python -m pytest tests/ --cov=app -v"

echo "✅ Dev Tests completed in ${SECONDS}s"

# ---- Production test ----
# echo "🚀 Testing production build..."

# # Clean previous containers
# docker-compose -f docker/dev/docker-compose.yml down -v

# docker build -f docker/prod/Dockerfile -t ${DOCKER_HUB_USERNAME}/devops-health-check:${TAG} .

# echo "🔧 Starting production containers..."
# TAG=test docker-compose -f docker/prod/docker-compose.yml up -d

# echo "⏱ Waiting for health endpoint..."
# ./scripts/wait-for-it.sh 30 "http://localhost:5000/health"

# echo "✅ Production build test passed!"