FROM php:8.1-apache

WORKDIR /var/www/html

RUN apt-get update
RUN apt-get install -y g++ libicu-dev libpq-dev libzip-dev zip zlib1g-dev cron
RUN docker-php-ext-install intl opcache pdo pdo_pgsql pgsql
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .
COPY cronjob /etc/cron.d/cronjob

RUN composer install --no-dev
 
RUN chmod 0644 /etc/cron.d/cronjob
RUN crontab /etc/cron.d/cronjob

RUN apt-get clean
 
RUN touch /var/log/cron.log
CMD cron && tail -f /var/log/cron.log
