# Base Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and related files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5500

# Expose the port
EXPOSE 5500

# Start the application
CMD ["pnpm", "run", "start"]