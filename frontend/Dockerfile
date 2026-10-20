# ── Horizn frontend (local Docker only; Vercel builds it without Docker) ──
# Stage 1: build the Vite app
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Leave VITE_API_URL empty so the app calls /api, which nginx forwards to the backend
ARG VITE_API_URL=
ARG VITE_MAPILLARY_ACCESS_TOKEN=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_MAPILLARY_ACCESS_TOKEN=$VITE_MAPILLARY_ACCESS_TOKEN
RUN npm run build

# Stage 2: serve the static files with nginx
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
