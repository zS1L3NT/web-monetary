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
            "username" => "zS1L3NT",
            "email" => "zechariahtan144@gmail.com",
            "password" => "P@ssw0rd"
        ]);
    }
}
