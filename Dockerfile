FROM node:22-alpine

WORKDIR /app

# Create non-root user first (better layer caching)
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy package files first for better caching
COPY --chown=nodejs:nodejs package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/ || exit 1

CMD ["node", "server.js"]
