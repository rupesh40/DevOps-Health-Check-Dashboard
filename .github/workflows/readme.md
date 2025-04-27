# DevOps Health Check Dashboard - CI/CD Setup  

This project automates testing and deployment using GitHub Actions.  

## **🛠️ Prerequisites**  
- GitHub account  
- Docker Hub account (for storing images)  
- A server with SSH access for deployment (optional)  

## **⚙️ Setup**  

### **1. Configure GitHub Secrets**  
Go to:  
`Settings → Secrets → Actions → New Repository Secret`  

Add these secrets:  
| Name | Value |  
|------|-------|  
| `DOCKER_HUB_USERNAME` | Your Docker Hub username |  
| `DOCKER_HUB_TOKEN` | Docker Hub access token |  
| `SSH_HOST` | `user@your-server-ip` | (optional) 

## 🚀 How It Works  
- **Automatic Trigger (push to main):**  
  ✅ Tests run (`pytest` + Docker checks)  
  ✅ If tests pass → Docker image is built & deployed  

- **Manual trigger:**  
  - Go to `Actions → CI/CD → Run workflow`  

- **Skip CI:**  
  Add `[skip ci]` in your commit message  

## **📂 Files Explained**  

### **CI/CD Workflow (`.github/workflows/ci-cd-prod.yml`)**  
- Runs tests  
- Builds & pushes Docker image  
- Deploys to production  

### **Scripts (`scripts/`)**  
| File | Purpose |  
|------|---------|  
| `test-ci.sh` | Runs tests in Docker |  
| `deploy-prod.sh` | Deploys with zero downtime |  
| `wait-for-it.sh` | Waits for app to start |  

### **Docker Files (`docker/`)**  
| File | Purpose |  
|------|---------|  
| `prod/Dockerfile` | Production Docker setup |  
| `prod/docker-compose.yml` | Runs app in production |  

---
 ### # Run CI/CD Pipeline Locally
 
 This guide explains how to test your GitHub Actions CI/CD workflow locally using [`act`](https://github.com/nektos/act).

## **Prerequisites**

1. **Docker**
  Ensure Docker daemon is running.

2. **`act` CLI**  
 Install based on your OS:
  ```bash
  # macOS
  brew install act

  # Linux
  curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

  # Windows (WSL recommended)
  choco install act-cli
  # OR
  scoop install act
  ```
3. **GitHub Secrets File**
  Create a .secrets file (do NOT commit this to Git):
```bash
  DOCKER_HUB_USERNAME=your_username
  DOCKER_HUB_TOKEN=your_token
  # SSH_HOST=user@server  # Uncomment if testing deployment
```

## **Steps to Run**

### 1. List Available Workflows

```bash
act -l
```

**Example output:**
```
Stage  Job ID  Workflow Name  Events
0      test    Production CI  workflow_dispatch,push,pull_request
0      deploy  Production CI  workflow_dispatch,push
```

---

### 2. Run the Entire Pipeline

```bash
act --secret-file .secrets -W .github/workflows/ci-cd-local.yml 
```

Simulates both test and deploy jobs using secrets from `.secrets`.

---

### 3. Run Specific Jobs

```bash
# Test only the "test" job
act -j test --secret-file .secrets

# Test only the "deploy" job (requires test job to pass first)
act -j deploy --secret-file .secrets
```

---

### 4. Debugging Tips

**Verbose Output:**
```bash
act -v --secret-file .secrets
```

**Use a Lightweight Runner (faster):**
```bash
act -P ubuntu-latest=nektos/act-environments-ubuntu:18.04
```

**Mock GitHub Events (e.g., push to main):**
```bash
act push --secret-file .secrets
```

---

## **Cleanup**

Stop all local `act` containers:

```bash
docker rm $(docker ps -a -q --filter "name=act-*") -f
docker image prune -a
```

---

## **Notes**

- **Windows Users**: Prefer WSL/Git Bash over CMD/PowerShell for path compatibility.
- **Docker Hub Rate Limits**: If hitting limits, authenticate with:

  ```bash
  echo $DOCKER_HUB_TOKEN | docker login -u $DOCKER_HUB_USERNAME --password-stdin
  ```

- **Skip Docker Push**: Add `push: false` to your workflow if testing locally.

---

## ⚠️ Warning

The `.secrets` file contains sensitive credentials. Add it to `.gitignore`:

```bash
echo ".secrets" >> .gitignore
```