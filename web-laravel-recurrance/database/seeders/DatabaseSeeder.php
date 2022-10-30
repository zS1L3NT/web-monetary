<?php

namespace Database\Seeders;

use App\Models\Recurrance;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Recurrance::factory(10)->create();
    }
}
