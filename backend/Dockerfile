# ── Horizn backend (Express API) ──────────────────────────────────────
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies (cached unless package files change)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# App source (.dockerignore keeps out node_modules, .env, uploads, logs)
COPY . .

# Run as the non-root "node" user that ships with the image
RUN chown -R node:node /app
USER node

# Render injects PORT at runtime; 3000 is the local default
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" > /dev/null || exit 1

CMD ["node", "app.js"]
