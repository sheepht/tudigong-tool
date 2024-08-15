#!/bin/sh

URL="https://dev.tudigong.idv.tw"

while true; do

  STATUS_CODE=$(wget --spider --server-response -O- "$URL" 2>&1 | awk '/^  HTTP/{print $2}' | tail -1)

  if [ $STATUS_CODE -eq 200 ]; then
    wget -q -O- "${PING_URL_WEB}"
  else
    wget -q -O- "${PING_URL_WEB}/fail"
  fi
  sleep 300
done