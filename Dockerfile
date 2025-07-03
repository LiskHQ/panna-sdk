ARG NODE_VERSION=22

## Stage 1

FROM node:$NODE_VERSION-alpine AS base

## Stage 2

FROM base as builder-base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    corepack use pnpm

## Stage 3

FROM builder-base AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile && \
    pnpm --recursive build && \
    pnpm deploy --filter=example-app --prod /prod/example-app

## Stage 4

FROM base AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN echo "NODE_ENV=${NODE_ENV}" && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /prod/example-app/public ./apps/example-app/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/example-app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/example-app/.next/static ./apps/example-app/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/example-app/server.js"]