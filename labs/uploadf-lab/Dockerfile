FROM php:8.2-apache


RUN docker-php-ext-install fileinfo


RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod 755 /var/www/html/uploads


COPY app/ /var/www/html/

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
