<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::query()->create([
            "email" => "zechariahtan144@gmail.com",
            "password" => "s3cuReP@ssw0rd"
        ]);
    }
}
