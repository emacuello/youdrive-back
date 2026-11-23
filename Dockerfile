FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache dumb-init \
    && addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --chown=nestjs:nodejs package.json ./
USER nestjs
# HTTP y Socket.IO (namespace /chat) en el mismo puerto. TypeORM crea el esquema (synchronize) y el seed de demo corre si no hay usuarios.
EXPOSE 3001
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main.js"]
