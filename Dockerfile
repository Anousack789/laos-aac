FROM node:20-slim AS deps

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy Prisma schema and package files
# COPY prisma ./prisma
COPY package.json pnpm-lock.yaml ./

# Install Python dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Generate Prisma client
# RUN pnpm prisma generate

# ------------------------------------------------------
# Stage 2: Builder
# ------------------------------------------------------
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy generated Prisma client from deps
# COPY --from=deps /app/src/generated/prisma ./src/generated/prisma

# Copy rest of the application
COPY . .

# Environment tweaks for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BUILD_WORKER_COUNT=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Declare the skip argument
ARG SKIP_ENV_VALIDATION=1
ENV SKIP_ENV_VALIDATION=$SKIP_ENV_VALIDATION

# Force Webpack (disable Turbopack) and build
RUN NEXT_DISABLE_TURBOPACK=1 pnpm build

# ------------------------------------------------------
# Stage 3: Runner (production image)
# ------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts

# Fix ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
