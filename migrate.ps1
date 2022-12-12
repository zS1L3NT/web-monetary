$services = @("account", "authentication", "budget", "category", "debt", "recurrence", "transaction")
foreach ($service in $services) {
    php web-laravel-monetary-$service/artisan migrate --seed
}