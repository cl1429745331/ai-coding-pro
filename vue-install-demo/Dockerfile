# Multi-stage build - Build stage
FROM node:18 AS build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage - Use nginx to serve static files
FROM nginx:latest AS production-stage

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts from build stage to nginx directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
