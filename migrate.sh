#!/bin/bash
php web-laravel-monetary-authentication/artisan migrate:fresh --seed --force
php web-laravel-monetary-account/artisan migrate --seed --force
php web-laravel-monetary-category/artisan migrate --seed --force
php web-laravel-monetary-transaction/artisan migrate --seed --force
php web-laravel-monetary-recurrence/artisan migrate --seed --force
php web-laravel-monetary-debt/artisan migrate --seed --force
php web-laravel-monetary-budget/artisan migrate --seed --force