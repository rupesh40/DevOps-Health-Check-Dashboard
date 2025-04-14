#!/bin/sh
curl -fs --max-time 5 http://localhost:5000/health >/dev/null || exit 1