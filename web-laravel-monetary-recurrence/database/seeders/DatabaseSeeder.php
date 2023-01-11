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
        Recurrence::factory(10)->create();
    }
}
