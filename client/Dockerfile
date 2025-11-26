# Build stage
FROM node:20 AS builder
WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# DELETE .babelrc explicitly to force SWC
RUN rm -f .babelrc && \
    echo "✅ .babelrc removed - forcing SWC"

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