# ──────────────────────────────────────────────
#  SkillHub Frontend – React / Vite
# ──────────────────────────────────────────────

# ── Stage 1: Build ─────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Build args – injected at build time by docker-compose
ARG VITE_API_URL=http://localhost:8000
ARG VITE_WS_URL=http://localhost:8000

# Vite reads VITE_* env vars at build time
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm run build

# ── Stage 2: Serve with Nginx ───────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/skillhub.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health-check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
