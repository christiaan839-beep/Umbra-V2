FROM oven/bun:1 as base

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./ 
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Execute standalone node build for extreme production speed
CMD ["node", "server.js"]
