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
        Transaction::factory()->create([
            'category_id' => DB::table('categories')->first()->id,
            'from_account_id' => DB::table('accounts')->first()->id,
            'to_account_id' => DB::table('accounts')->skip(1)->first()->id,
            'type' => 'Transfer',
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table('categories')->first()->id,
            'from_account_id' => DB::table('accounts')->first()->id,
            'type' => 'Outgoing',
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table('categories')->first()->id,
            'from_account_id' => DB::table('accounts')->first()->id,
            'type' => 'Incoming',
        ]);
    }
}
