# ---------- stage 1: build ----------
FROM node:18-alpine AS builder
RUN apk add --no-cache pnpm
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json ./

# зависимости
RUN --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
  pnpm ci

COPY src ./src
COPY test ./test
COPY eslint.config.mjs tsconfig.build.json tsconfig.json ./
RUN pnpm run build


# ---------- stage 2: production ----------
FROM node:lts-alpine3.23
RUN apk add --no-cache pnpm

WORKDIR /app

ENV NODE_ENV=production

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
  pnpm ci --omit=dev

COPY --from=builder /app/dist/ ./dist/
CMD exec node dist/main.js
