<?php

namespace Database\Seeders;

use App\Models\Recurrence;
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
                Recurrence::factory(1)->create();
            } catch (\Exception $e) {
            }
        }
    }
}
