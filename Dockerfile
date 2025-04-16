# Stage 1: Build the Angular application
FROM node:current-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json/bun.lock
COPY package.json bun.lock* package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS production

# Install OpenSSL to generate self-signed certificates
RUN apk add --no-cache openssl

# Create directory for certificates
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/sport-timer-app/browser /usr/share/nginx/html

# Copy our custom nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose both HTTP and HTTPS ports
EXPOSE 80 443

# When the container starts, nginx will serve the Angular app
CMD ["nginx", "-g", "daemon off;"]