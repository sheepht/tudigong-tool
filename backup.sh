#!/bin/bash

# 0 0 * * * ENV=prd bash $HOME/backup/slack-and-mail.sh
# $HOME/backup/script.sh 內容如下
# env $(cat $HOME/web/$ENV/.env $HOME/web/$ENV/.env.web $HOME/web/$ENV/.env.service | xargs) bash $HOME/web/$ENV/backup.sh

BACKUP_PATH="$HOME/backup"

cd $HOME/web/$ENV

# 設定要備份的檔案
FILE_PATH="${BACKUP_PATH}/database.sql" # 修改為你要備份的檔案路徑

# 備份資料庫
env $(cat .env .env.service | xargs) docker compose exec $ENV-db mysqldump -uroot -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > $FILE_PATH

# 設定 Slack 的參數
SLACK_CHANNEL_ID="${SLACK_CHANNEL_ID}" # 修改為你要上傳檔案的 Slack 頻道 ID
SLACK_TOKEN="${SLACK_TOKEN}" # 修改為你的 Slack Bot Token


# Get the file name
FILE_NAME=$(basename "$FILE_PATH")

# Generate a random 16-character password
PASSWORD=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 16)

# Create a temporary zip file with yyyymmdd format
CURRENT_DATE=$(date +"%Y%m%d")

# Create a temporary zip file
ZIP_FILE_PATH="${BACKUP_PATH}/databased_${CURRENT_DATE}.zip"

# Compress the file with password
zip -j -P "$PASSWORD" "$ZIP_FILE_PATH" "$FILE_PATH"

if [ $? -ne 0 ]; then
    echo "Failed to create zip file"
    exit 1
fi


# Get the new file name (zip file)
ZIP_FILE_NAME=$(basename "$ZIP_FILE_PATH")

# Step 1: Get the upload URL
UPLOAD_URL_RESPONSE=$(curl -s -X POST "https://slack.com/api/files.getUploadURLExternal" \
    -H "Authorization: Bearer $SLACK_TOKEN" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data-urlencode "filename=$ZIP_FILE_NAME" \
    --data-urlencode "length=$(wc -c < "$ZIP_FILE_PATH")")

UPLOAD_URL=$(echo "$UPLOAD_URL_RESPONSE" | jq -r '.upload_url')
FILE_ID=$(echo "$UPLOAD_URL_RESPONSE" | jq -r '.file_id')

if [ -z "$UPLOAD_URL" ] || [ -z "$FILE_ID" ]; then
    echo "Failed to get upload URL or file ID"
    exit 1
fi

# Step 2: Upload the file
UPLOAD_RESPONSE=$(curl -s -X POST "$UPLOAD_URL" \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@$ZIP_FILE_PATH")

# Check if the upload response starts with "OK"
if [[ "$UPLOAD_RESPONSE" != OK* ]]; then
    echo "Failed to upload file"
    echo "Upload response: $UPLOAD_RESPONSE"
    exit 1
fi

echo "File uploaded successfully. Response: $UPLOAD_RESPONSE"

# Step 3: Complete the upload
COMPLETE_RESPONSE=$(curl -s -X POST "https://slack.com/api/files.completeUploadExternal" \
    -H "Authorization: Bearer $SLACK_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"files\": [{
            \"id\": \"$FILE_ID\",
            \"title\": \"$ZIP_FILE_NAME\"
        }],
        \"channel_id\": \"$SLACK_CHANNEL_ID\",
        \"initial_comment\": \"已備份: $PASSWORD\"
    }")

SUCCESS=$(echo "$COMPLETE_RESPONSE" | jq -r '.ok')

if [ "$SUCCESS" = "true" ]; then
    echo "File upload process completed successfully!"

    TO="tudegong2024@gmail.com"
    SUBJECT="BACUP DATABASE"

    swaks --to "$TO" \
        --from "tudegong2024@gmail.com" \
        --server smtp.gmail.com:587 \
        --auth LOGIN \
        --auth-user "tudegong2024@gmail.com" \
        --auth-password "${GMAIL_APP_PASS}" \
        --tls \
        --body "$PASSWORD" \
        --header "Subject: $SUBJECT" \
        --attach "@${ZIP_FILE_PATH}"

    rm ${ZIP_FILE_PATH}
    rm ${FILE_PATH}
else
    echo "Failed to complete file upload"
    echo "$COMPLETE_RESPONSE"
fi
