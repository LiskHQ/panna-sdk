ARG NODE_VERSION=22

## Stage 1

FROM node:$NODE_VERSION-alpine AS base

## Stage 2

FROM base AS builder-base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && \
    corepack use pnpm

## Stage 3

FROM builder-base AS builder
WORKDIR /app
COPY . .
ARG NEXT_PUBLIC_CLIENT_ID=""
ENV NEXT_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_CLIENT_ID}
ARG NEXT_PUBLIC_PARTNER_ID=""
ENV NEXT_PUBLIC_PARTNER_ID=${NEXT_PUBLIC_PARTNER_ID}
ARG NEXT_PUBLIC_CHAIN_ID=""
ENV NEXT_PUBLIC_CHAIN_ID=${NEXT_PUBLIC_CHAIN_ID}
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile && \
    pnpm --recursive build

## Stage 4

FROM base AS runner
WORKDIR /app

ARG BUILD_APP=example-app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/${BUILD_APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${BUILD_APP}/public ./apps/${BUILD_APP}/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/${BUILD_APP}/.next/static ./apps/${BUILD_APP}/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENV SERVER_FILEPATH="apps/${BUILD_APP}/server.js"
CMD ["sh", "-c", "node ${SERVER_FILEPATH}"]
