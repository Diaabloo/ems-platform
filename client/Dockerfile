# ============================
# 1) Build Stage
# ============================
FROM node:20 AS builder
WORKDIR /app

# Variables d'environnement pour le build (tu peux les modifier ici)
ENV NEXT_PUBLIC_API_URL=/api
ENV BACKEND_API_URL=http://backend.ems-platform.svc.cluster.local:5000/api

# Désactiver Babel, désactiver telemetry Next.js
ENV NEXT_DISABLE_BABEL=1
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY . .

# Supprimer les configs Babel (optionnel si tu veux vraiment forcer SWC)
RUN find . -name ".babelrc" -delete && \
    find . -name "*.babel*" -delete && \
    find . -name "babel.config.*" -delete && \
    echo "🔥 Babel configs deleted"

RUN rm -f .env .env.local .env.development .env.production

RUN echo "NEXT_PUBLIC_API_URL=/api" > .env.production

# Build Next.js avec les variables d'env ci-dessus
RUN npm run build

# ============================
# 2) Production Stage
# ============================
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production

# IMPORTANT : définir aussi les variables d'environnement pour la prod runtime
ENV NEXT_PUBLIC_API_URL=/api
ENV BACKEND_API_URL=http://backend.ems-platform.svc.cluster.local:5000/api
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start", "--", "-H", "0.0.0.0"]
