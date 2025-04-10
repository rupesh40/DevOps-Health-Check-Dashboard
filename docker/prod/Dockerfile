# Stage 1: Builder
FROM python:3.12-slim as builder

# Install system dependencies + build essentials
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m appuser && \
    mkdir -p /app/data && \
    chown appuser:appuser /app /app/data

WORKDIR /app

# Install dependencies separately for caching
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Stage 2: Runtime
FROM python:3.12-slim

# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder --chown=appuser /home/appuser/.local /home/appuser/.local
COPY --from=builder --chown=appuser /app /app

# Ensure scripts in .local are usable
ENV PATH=/home/appuser/.local/bin:$PATH

WORKDIR /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl --fail http://localhost:5000/health || exit 1

# Run (using exec form for proper signal handling)
CMD ["python", "-m", "app.run"]