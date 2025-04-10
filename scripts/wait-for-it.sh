#!/bin/bash
TIMEOUT=${1:-60}
TARGET=${2:-"http://localhost:5000/health"}

echo "⏳ Waiting for $TARGET (timeout: $TIMEOUT sec)..."

START=$(date +%s)
while :; do
  curl -sf $TARGET >/dev/null 2>&1 && break
  
  if [ $(($(date +%s) - START)) -ge $TIMEOUT ]; then
    echo "❌ Timeout reached"
    exit 1
  fi
  
  sleep 1
  echo -n "."
done

echo -e "\n✅ Service is ready!"

#--------------------------------------------------------------------------------------


# #!/bin/bash
# # Usage: ./wait-for-it.sh -t 30 "http://localhost:5000/health"
# TIMEOUT=30
# TARGET="http://localhost:5000/health"

# while getopts ":t:" opt; do
#   case $opt in
#     t) TIMEOUT="$OPTARG" ;;
#     *) echo "Usage: $0 [-t timeout] target" >&2; exit 1 ;;
#   esac
# done
# shift $((OPTIND-1))

# if [ $# -gt 0 ]; then
#   TARGET=$1
# fi

# echo "⏳ Waiting for $TARGET (timeout: $TIMEOUT sec)..."

# START_TIME=$(date +%s)
# while :; do
#   curl --silent --fail $TARGET >/dev/null 2>&1
#   if [ $? -eq 0 ]; then
#     echo "✅ Service is up!"
#     exit 0
#   fi

#   if [ $(($(date +%s) - START_TIME)) -gt $TIMEOUT ]; then
#     echo "❌ Timeout reached" >&2
#     exit 1
#   fi

#   sleep 1
# done


