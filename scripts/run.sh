# /bin/bash

while getopts s:p:a:b:k:x: flag
do
    case "${flag}" in
        s) storage_mode=${OPTARG};;
        p) storage_path=${OPTARG};;
        a) cloudflare_account_id=${OPTARG};;
        b) cloudflare_bucket_name=${OPTARG};;
        k) aws_access_key_id=${OPTARG};;
        x) aws_secret_access_key=${OPTARG};;
    esac
done

if [ -z "$storage_mode" ]; then storage_mode="FILESYSTEM"; fi
if [ -z "$storage_path" ]; then storage_path="$PWD"; fi


docker run \
 -p 3000:3000 \
 -e NODE_ENV="production" \
 -e STORAGE_MODE="$storage_mode" \
 -e SUBMISSION_STORAGE_PATH="/app/submissions" \
 -e CLOUDFLARE_ACCOUNT_ID="$cloudflare_account_id" \
 -e CLOUDFLARE_BUCKET_NAME="$cloudflare_bucket_name" \
 -e AWS_ACCESS_KEY_ID="$aws_access_key_id" \
 -e AWS_SECRET_ACCESS_KEY="$aws_secret_access_key" \
  -v "$storage_path":/app/submissions \
   submissions-app:latest