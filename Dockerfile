
ARG NODE_ENV
ARG STORAGE_MODE
ARG SUBMISSION_STORAGE_PATH
ARG CLOUDFLARE_ACCOUNT_ID
ARG CLOUDFLARE_BUCKET_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
# Setup initial dependencies.

FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install


# Build production version.
FROM node:18-alpine AS builder
ARG STORAGE_MODE
ENV STORAGE_MODE $STORAGE_MODE

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# Run app

ARG NODE_ENV
ARG STORAGE_MODE
ARG SUBMISSION_STORAGE_PATH
ARG CLOUDFLARE_ACCOUNT_ID
ARG CLOUDFLARE_BUCKET_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

ENV NODE_ENV $NODE_ENV
ENV STORAGE_MODE $STORAGE_MODE
ENV SUBMISSION_STORAGE_PATH $SUBMISSION_STORAGE_PATH
ENV CLOUDFLARE_ACCOUNT_ID $CLOUDFLARE_ACCOUNT_ID
ENV CLOUDFLARE_BUCKET_NAME $CLOUDFLARE_BUCKET_NAME
ENV AWS_ACCESS_KEY_ID $AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY $AWS_SECRET_ACCESS_KEY

FROM node:18-alpine
RUN mkdir -p /app/submissions
WORKDIR /app

# RUN addgroup --g 1024 nodejs
# RUN adduser -u 1024 -G nodejs -h /app/submissions -D nextjs
 

COPY --from=builder /app .


# USER nextjs


EXPOSE 3000
CMD ["npm", "run", "start"]