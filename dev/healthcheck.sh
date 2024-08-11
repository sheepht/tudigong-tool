#!/bin/sh

while true; do
  if wget -q -O- http://service:8080/health > /dev/null 2>&1; then
    wget -q -O- "${PING_URL}"
  else
    wget -q -O- "${PING_URL}/fail"
  fi
  sleep 300
done