# Multi-stage build for Vite React app

# Stage 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (Vite outputs to /dist)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets from build stage (Vite uses /dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]