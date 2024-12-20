FROM node:20-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN  npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG BASE_PATH="/selfservice"
ENV BASE_PATH=${BASE_PATH}

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER node
EXPOSE ${PORT}

CMD ["node", "server.js"]
