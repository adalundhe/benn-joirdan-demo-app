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

docker build \
 --no-cache \
 --build-arg NODE_ENV="production" \
 --build-arg STORAGE_MODE="$storage_mode" \
 --build-arg SUBMISSION_STORAGE_PATH="/app/submissions" \
 --build-arg CLOUDFLARE_ACCOUNT_ID="$cloudflare_account_id" \
 --build-arg CLOUDFLARE_BUCKET_NAME="$cloudflare_bucket_name" \
 --build-arg AWS_ACCESS_KEY_ID="$aws_access_key_id" \
 --build-arg AWS_SECRET_ACCESS_KEY="$aws_secret_access_key" \
 --tag submissions-app:latest \
 "$PWD"
