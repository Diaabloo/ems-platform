# Build stage
FROM node:20 AS builder
WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm ci

# Copy source code and EXPLICITLY DELETE .babelrc
COPY . .

# FORCE DELETE .babelrc and any babel configs
RUN find . -name ".babelrc" -delete && \
    find . -name "*.babel*" -delete && \
    find . -name "babel.config.*" -delete && \
    echo "✅ ALL BABEL CONFIGS DELETED"

# Verify deletion
RUN if [ -f ".babelrc" ]; then echo "❌ .babelrc STILL EXISTS" && exit 1; else echo "✅ .babelrc successfully deleted"; fi

# Build with forced SWC
ENV NEXT_DISABLE_BABEL=1
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
