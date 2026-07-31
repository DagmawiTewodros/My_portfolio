# This will be set by the GitHub action to the folder containing this component.
ARG FOLDER=/app

FROM node:24-slim AS base

# Enable corepack
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Setup PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
RUN mkdir -p /home/codespace/.pnpm-store /pnpm \
  && chown -R 1000:1000 /home/codespace/.pnpm-store /pnpm

COPY --from=oven/bun:1.3.11 /usr/local/bin/bun /usr/local/bin/bun

# Install dependencies only when needed
FROM base AS deps
ARG FOLDER

COPY . /app
WORKDIR ${FOLDER}

# Install dependencies based on the preferred package manager
RUN \
  if [ -f bun.lockb ] || [ -f bun.lock ]; then bun install --frozen-lockfile || bun install; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile || yarn install; \
  elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile || pnpm i; \
  elif [ -f package-lock.json ]; then npm ci || npm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
ARG FOLDER
COPY . /app
WORKDIR ${FOLDER}
COPY --from=deps ${FOLDER}/node_modules ./node_modules

RUN \
  if [ -f bun.lockb ] || [ -f bun.lock ]; then bun run build; \
  elif [ -f yarn.lock ]; then yarn run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the built files
# NOTE: Build will be run again in an init-container to include ENV
FROM base AS runner
ARG FOLDER

COPY --from=builder --chown=1000:1000 /app /app
WORKDIR ${FOLDER}

ENV NODE_ENV=production

USER 1000:1000

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN npm i -g serve

EXPOSE 80
ENV PORT=80
ENV HOST="0.0.0.0"
ENV HOSTNAME="0.0.0.0"
ENV NITRO_PORT=80
ENV NITRO_HOST="0.0.0.0"

CMD sh -c '\
  if [ -d dist/server ] && [ -f server.ts ]; then \
  echo "Found server.ts —> starting Bun"; \
  exec bun run server.ts; \
  else \
  echo "No server build found —> serving static dist"; \
  exec serve -s -l ${PORT:-80} dist; \
  fi'
