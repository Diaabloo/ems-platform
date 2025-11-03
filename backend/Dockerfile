# backend/Dockerfile
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Install Prisma CLI and client explicitly
RUN npm install prisma@6.18.0 --save-dev
RUN npm install @prisma/client@6.18.0

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the backend code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]