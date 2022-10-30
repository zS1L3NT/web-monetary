<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Transaction::factory(5)->create([
            'type' => 'Transfer',
        ]);
        Transaction::factory(5)->create([
            'type' => 'Outgoing',
        ]);
        Transaction::factory(5)->create([
            'type' => 'Incoming',
        ]);
    }
}
