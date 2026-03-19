# Stage 1: Base
FROM node:20-slim AS base
RUN corepack enable
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
COPY client/package.json ./client/

# Stage 2: Dependencies
FROM base AS deps
# Use --no-frozen-lockfile during development/debugging if lockfile was from Windows
RUN pnpm install --no-frozen-lockfile

# Stage 3: Build
FROM deps AS builder
COPY . .
# Run build with filter to pinpoint errors and get more output
RUN pnpm run build

# Stage 4: Backend Production Image
FROM node:20-slim AS backend
WORKDIR /app
RUN corepack enable
COPY --from=builder /app ./
WORKDIR /app/backend
EXPOSE 3000
CMD ["pnpm", "start"]

# Stage 5: Frontend Production Image (Nginx)
FROM nginx:stable-alpine AS frontend
COPY --from=builder /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
