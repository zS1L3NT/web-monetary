<?php

namespace Database\Seeders;

use App\Models\Debt;
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
        Debt::factory(5)->create();
    }
}
