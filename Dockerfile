# Use official PHP image with Apache
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy project files into the web directory
COPY . /var/www/html/

# Expose port 80 for web traffic
EXPOSE 80

