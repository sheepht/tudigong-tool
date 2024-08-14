#!/bin/sh

URL="https://dev.tudigong.idv.tw"

while true; do

  # 發送 HTTP 請求並取得狀態碼
  STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" $URL)

  if [ $STATUS_CODE -eq 200 ]; then
    wget -q -O- "${PING_URL_WEB}"
  else
    wget -q -O- "${PING_URL_WEB}/fail"
  fi
  sleep 300
done