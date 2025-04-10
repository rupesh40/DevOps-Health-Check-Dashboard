#!/bin/sh
curl -fs --max-time 5 http://localhost:5000/health >/dev/null || exit 1

# ---------------------------------------------------------------------------

# #!/bin/sh
# # Advanced health check with timeout
# curl --fail --silent --max-time 5 http://localhost:5000/health || exit 1