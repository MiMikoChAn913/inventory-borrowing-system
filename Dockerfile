FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY client client
COPY server server
COPY scripts scripts
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build pnpm --filter server db:generate
RUN pnpm build

FROM node:24-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=app:app /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/server ./server
COPY --from=build --chown=app:app /app/client/package.json ./client/package.json
RUN chown app:app /app
USER app
EXPOSE 3000
CMD ["node", "server/src/index.js"]
