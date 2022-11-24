$services = @("account", "authentication", "budget", "category", "debt", "recurrence", "transaction")
for ($i = 1; $i -le 7; $i++) {
    $service = $services[$i - 1]
    docker build laravel-$service -t web-laravel-monetary-$service
    docker run -d --env-file laravel-$service/.env -p 800${i}:80 --name web-laravel-monetary-$service web-laravel-monetary-$service
}