# Use official PHP image with Apache
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Copy project files into the web directory
COPY . /var/www/html/

# Set permissions for uploads and qrcodes folders
RUN mkdir -p /var/www/html/uploads /var/www/html/qrcodes \
    && chown -R www-data:www-data /var/www/html/uploads /var/www/html/qrcodes \
    && chmod -R 755 /var/www/html/uploads /var/www/html/qrcodes

# Expose port 80 for web traffic
EXPOSE 80


