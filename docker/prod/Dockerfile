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

# Install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt gunicorn

# Copy application - more selective than dev
COPY app/ app/
COPY migrations/ migrations/
COPY *.py ./

# Stage 2: Runtime
FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m appuser

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder --chown=appuser /home/appuser/.local /home/appuser/.local
COPY --from=builder --chown=appuser /app /app

# Explicitly set Python path 
ENV PYTHONPATH=/app 

WORKDIR /app
USER appuser

# Verify file structure
RUN ls -la /app && \
    ls -la /app/app  # Debugging line

HEALTHCHECK --interval=15s --timeout=3s --start-period=45s --retries=5 \
    CMD curl -f http://localhost:5000/health || exit 1

# Production-grade server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:create_app"]  # Adjust 'create_app' to your factory function