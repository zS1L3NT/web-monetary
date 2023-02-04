<?php

namespace Database\Seeders;

use App\Models\Account;
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
        Account::factory()->create([
            'name' => 'Savings',
            'initial_balance' => 1077.76 + 320.1,
            'color' => '#64b5f6'
        ]);
        Account::factory()->create([
            'name' => 'PayNow',
            'initial_balance' => 63.05 - 63.35,
            'color' => '#ab47bc'
        ]);
        Account::factory()->create([
            'name' => 'PayLah',
            'initial_balance' => 180.25 - 178.4,
            'color' => '#ec407a'
        ]);
        Account::factory()->create([
            'name' => 'Grab',
            'initial_balance' => 8.50,
            'color' => '#4caf50'
        ]);
        Account::factory()->create([
            'name' => 'Wallet',
            'initial_balance' => 209.3 -208.4,
            'color' => '#212121'
        ]);

    }
}
