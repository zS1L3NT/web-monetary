<?php

namespace Database\Seeders;

use App\Models\Debt;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Debt::factory()->create([
            'type' => 'Lend',
            'amount' => 5.2,
            'due_date' => Carbon::parse('2022-06-30'),
            'name' => 'Darren Ong',
            'description' => 'Dinner',
            'active' => true,
        ]);
    }
}
