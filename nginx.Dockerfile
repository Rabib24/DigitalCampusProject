# Nginx Dockerfile for Digital Campus Project

FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directories for SSL certificates (if needed)
RUN mkdir -p /etc/nginx/ssl

# Create directories for static and media files
RUN mkdir -p /app/static /app/media

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]