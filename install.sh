#!/bin/bash
composer install --working-dir=web-laravel-monetary-account
composer install --working-dir=web-laravel-monetary-authentication
composer install --working-dir=web-laravel-monetary-budget
composer install --working-dir=web-laravel-monetary-category
composer install --working-dir=web-laravel-monetary-debt
composer install --working-dir=web-laravel-monetary-recurrence
composer install --working-dir=web-laravel-monetary-transaction
pnpm i --dir web-react-monetary