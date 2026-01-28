FROM php:8.2-apache

# Install SQLite system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Enable SQLite PDO extension
RUN docker-php-ext-install pdo_sqlite

# Copy application files
COPY app/ /var/www/html/

# Initialize SQLite database
RUN sqlite3 /var/www/html/users.db < /var/www/html/init.sql

# permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
