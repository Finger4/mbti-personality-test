FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json ./
# 如果没有 package-lock.json 先生成
RUN if [ ! -f package-lock.json ]; then npm install --package-lock-only; fi
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000
ENV PORT 3000

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# public 目录可能不存在，仅在存在时复制
RUN if [ -d /app/public ]; then cp -r /app/public ./public; fi

CMD ["node", "server.js"]
