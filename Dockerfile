# Use Node.js 18 LTS
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies (use ci for faster installs)
RUN npm ci --only=production --ignore-scripts

# Copy server code
COPY server ./server

# Create logs directory
RUN mkdir -p logs

# Use PORT environment variable from Cloud Run
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server/index.js"]
