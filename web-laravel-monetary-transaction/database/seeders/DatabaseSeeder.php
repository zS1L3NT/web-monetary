<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
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
            'category_id' => DB::table("categories")->where("name", "Lunch")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 7.45,
            'date' => Carbon::parse('2023-02-03 18:43:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Breakfast")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 2.7,
            'date' => Carbon::parse('2023-02-03 08:49:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Dinner")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 8.35,
            'date' => Carbon::parse('2023-02-02 18:40:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Electronics")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Savings")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 20.10,
            'date' => Carbon::parse('2023-02-03 12:32:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Wallet")->first()->id,
            'to_account_id' => null,
            'type' => 'Incoming',
            'amount' => 1.6,
            'date' => Carbon::parse('2023-02-02 12:21:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Lunch")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 1.1,
            'date' => Carbon::parse('2023-02-01 13:06:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'type' => 'Transfer',
            'amount' => 200,
            'date' => Carbon::parse('2023-02-01 08:30:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Red Packets")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Wallet")->first()->id,
            'to_account_id' => null,
            'type' => 'Incoming',
            'amount' => 202,
            'date' => Carbon::parse('2023-02-01 07:51:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Breakfast")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 2,
            'date' => Carbon::parse('2023-02-01 07:51:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Life")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 10,
            'date' => Carbon::parse('2023-01-31 20:00:00'),
            'description' => 'YAM Staycation'
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Dinner")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 4.8,
            'date' => Carbon::parse('2023-01-31 18:10:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Drinks")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 1.4,
            'date' => Carbon::parse('2023-01-31 15:00:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Drinks")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Wallet")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 2.3,
            'date' => Carbon::parse('2023-01-30 20:30:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => DB::table("accounts")->where("name", "Wallet")->first()->id,
            'type' => 'Transfer',
            'amount' => 10,
            'date' => Carbon::parse('2023-01-30 20:25:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'type' => 'Transfer',
            'amount' => 2.9,
            'date' => Carbon::parse('2023-01-30 20:20:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'type' => 'Transfer',
            'amount' => 2,
            'date' => Carbon::parse('2023-01-30 20:15:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Wallet")->first()->id,
            'to_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'type' => 'Transfer',
            'amount' => 2.9,
            'date' => Carbon::parse('2023-01-30 20:10:00'),
            'description' => 'Elroy\'s Bubble Tea'
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'type' => 'Transfer',
            'amount' => 8,
            'date' => Carbon::parse('2023-01-30 20:05:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Dinner")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 8.3,
            'date' => Carbon::parse('2023-01-30 20:00:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Others")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Savings")->first()->id,
            'to_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'type' => 'Transfer',
            'amount' => 300,
            'date' => Carbon::parse('2023-01-30 09:59:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Missing")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 2.35,
            'date' => Carbon::parse('2023-01-30 09:57:00'),
            'description' => ''
        ]);

        Transaction::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Breakfast")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 2.7,
            'date' => Carbon::parse('2023-01-30 09:48:00'),
            'description' => ''
        ]);
    }
}
