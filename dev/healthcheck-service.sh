#!/bin/sh

while true; do
  if wget -q -O- http://dev-service:8080/health > /dev/null 2>&1; then
    wget -q -O- "${PING_URL_SERVICE}"
  else
    wget -q -O- "${PING_URL_SERVICE}/fail"
  fi
  sleep 300
done