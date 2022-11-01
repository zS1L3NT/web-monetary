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
        for ($i = 0; $i < 10; $i++) {
            try {
                Recurrance::factory(1)->create();
            } catch (\Exception $e) {
            }
        }
    }
}
