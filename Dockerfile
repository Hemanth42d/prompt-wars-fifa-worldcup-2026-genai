# Multi-stage build for production
FROM node:18-slim AS frontend-builder

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Backend stage
FROM node:18-slim

WORKDIR /app

# Copy backend package files
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copy server code
COPY server ./server

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/client/dist ./client/dist

# Create logs directory
RUN mkdir -p logs

# Use PORT environment variable from Cloud Run
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server/index.js"]
