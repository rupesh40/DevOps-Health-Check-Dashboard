# Stage 1: Builder
FROM python:3.12-slim AS builder

# Install build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Create user structure
RUN useradd -m appuser && \
    mkdir -p /app /home/appuser/.local && \
    chown appuser:appuser /app /home/appuser/.local

WORKDIR /app

# Cache dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt pytest pytest-cov

COPY . .

# Stage 2: Runtime
FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m appuser

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder --chown=appuser /home/appuser/.local /home/appuser/.local
COPY --from=builder --chown=appuser /app /app

ENV PATH=/home/appuser/.local/bin:$PATH
WORKDIR /app
USER appuser

HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:5000/health
CMD ["python", "-m", "run"]