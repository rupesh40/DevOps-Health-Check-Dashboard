# 📂 SCRIPTS REFERENCE GUIDE

## Overview

This directory contains bash scripts used in the CI/CD pipeline for automating testing, deployment, and service health checks.

---

## 📄 File Summary

| File             | Purpose                            |
|------------------|-------------------------------------|
| `deploy.sh`      | Zero-downtime production deployment |
| `test-ci.sh`     | Runs unit + integration tests       |
| `wait-for-it.sh` | Health check for services           |

---

## 🚀 `deploy.sh`

**Purpose:**  
Deploys the latest Docker image to production without downtime.

### 🔧 Usage

```bash
./scripts/deploy.sh <TAG>
```

- **TAG (required):** Docker image tag (usually `${{ github.sha }}` in CI/CD).

### ⚙️ How It Works

- Pulls the Docker image from the registry.
- Updates containers using `docker-compose up --no-deps` to ensure no downtime.
- Runs health checks to confirm the app is live.

### 📌 Example

```bash
./scripts/deploy.sh abc123  # Deploys image tagged `abc123`
```

### 🌍 Required Environment Variables

```bash
DOCKER_HUB_USERNAME  # Docker Hub username  
DOCKER_HUB_TOKEN     # Docker Hub access token (for private repos)
```

---

## 🧪 `test-ci.sh`

**Purpose:**  
Runs unit tests and Dockerized integration tests.

### 🔧 Usage

```bash
./scripts/test-ci.sh
```

### ⚙️ What It Does

- Builds a development Docker environment.
- Runs `pytest` inside the container.
- Tests the production Docker setup (builds image + checks health).

### 📌 Example

```bash
./scripts/test-ci.sh  # Runs all tests
```

### 📁 Required Files

```bash
docker/dev/docker-compose.yml   # Dev environment setup  
docker/prod/Dockerfile          # Production Docker image  
```

---

## ⏳ `wait-for-it.sh`

**Purpose:**  
Waits for a service (e.g., HTTP endpoint) to be ready.

### 🔧 Usage

```bash
./scripts/wait-for-it.sh -t <TIMEOUT> <HOST:PORT_or_URL>
```

- **`-t TIMEOUT`**: Max wait time (seconds). Default is `30`.
- **`HOST:PORT_or_URL`**: Target to check (e.g., `localhost:5000` or `http://localhost/health`).

### 📌 Example

```bash
./scripts/wait-for-it.sh -t 60 http://localhost:5000/health
```

### 🔁 Exit Codes

- `0`: Service is ready.
- `1`: Timeout or connection failed.

---

## 🔧 Customization Guide

### For `deploy.sh`

Change `docker-compose.yml` path:

```bash
COMPOSE_FILE="your-path/docker-compose.yml"
```

### For `test-ci.sh`

Modify `pytest` arguments:

```bash
pytest tests/ --cov=app --cov-report=xml
```

### For `wait-for-it.sh`

Adjust timeout:

```bash
TIMEOUT=90 ./wait-for-it.sh http://service:8000
```

---

## 📌 Best Practices

- **Test Locally:** Run scripts manually before pushing to CI/CD

```bash
./scripts/test-ci.sh && ./scripts/deploy.sh test
```

- **Logs:** Use `set -x` in scripts for debugging.
- **Permissions:** Ensure scripts are executable:

```bash
chmod +x scripts/*.sh
```

---

## 🚀 Next Steps

- Set up GitHub Secrets for Docker Hub and SSH.
- Modify paths in scripts to match your project structure.
- Push to `main` to trigger the CI/CD pipeline.

For workflow details, see [`.github/workflows/README.md`](../.github/workflows/README.md).
