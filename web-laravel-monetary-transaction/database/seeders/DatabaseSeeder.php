<?php

namespace Database\Seeders;

use App\Models\Transaction;
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
        for ($i = 0; $i < 50; $i++) {
            try {
                Transaction::factory(1)->create(
                    [
                        'type' => 'Incoming',
                    ]
                );
            } catch (\Exception $e) {
            }
            try {
                Transaction::factory(1)->create(
                    [
                        'type' => 'Outgoing',
                    ]
                );
            } catch (\Exception $e) {
            }
            try {
                Transaction::factory(1)->create(
                    [
                        'type' => 'Transfer',
                    ]
                );
            } catch (\Exception $e) {
            }
        }
    }
}
