<?php

namespace Database\Seeders;

use App\Models\Recurrence;
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
        Recurrence::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Google One")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'name' => 'Google One',
            'amount' => 2.79,
            'description' => 'Google One subscription',
            'automatic' => true,
            'period_start_date' => Carbon::parse('2023-02-01 00:00:00'),
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => null,
            'period_end_count' => null
        ]);

        Recurrence::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Spotify")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'name' => 'Spotify',
            'amount' => 17.46,
            'description' => 'Spotify subscription',
            'automatic' => true,
            'period_start_date' => Carbon::parse('2023-02-01 00:00:00'),
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => null,
            'period_end_count' => null
        ]);

        Recurrence::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Spotify")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Incoming',
            'name' => 'Spotify (Axios)',
            'amount' => 3.5,
            'description' => 'Spotify subscription',
            'automatic' => false,
            'period_start_date' => Carbon::parse('2023-02-01 00:00:00'),
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => null,
            'period_end_count' => null
        ]);

        Recurrence::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Spotify")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayLah")->first()->id,
            'to_account_id' => null,
            'type' => 'Incoming',
            'name' => 'Spotify (Jun Jie)',
            'amount' => 3.5,
            'description' => 'Spotify subscription',
            'automatic' => false,
            'period_start_date' => Carbon::parse('2023-02-01 00:00:00'),
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => null,
            'period_end_count' => null
        ]);

        Recurrence::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Spotify")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Wallet")->first()->id,
            'to_account_id' => null,
            'type' => 'Incoming',
            'name' => 'Spotify (Mattias)',
            'amount' => 3.5,
            'description' => 'Spotify subscription',
            'automatic' => false,
            'period_start_date' => Carbon::parse('2023-02-01 00:00:00'),
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => null,
            'period_end_count' => null
        ]);

        Recurrence::factory()->create([
            'category_id' => DB::table("categories")->where("name", "Spotify")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "PayNow")->first()->id,
            'to_account_id' => null,
            'type' => 'Incoming',
            'name' => 'Spotify (Yi Fan)',
            'amount' => 3.5,
            'description' => 'Spotify subscription',
            'automatic' => false,
            'period_start_date' => Carbon::parse('2023-02-01 00:00:00'),
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => null,
            'period_end_count' => null
        ]);

        Recurrence::factory()->create([
            'category_id' => DB::table("categories")->where("name", "IU")->first()->id,
            'from_account_id' => DB::table("accounts")->where("name", "Wallet")->first()->id,
            'to_account_id' => null,
            'type' => 'Outgoing',
            'name' => 'IU Documentary',
            'amount' => 10,
            'description' => '',
            'automatic' => false,
            'period_start_date' => Carbon::parse('2023-02-01 00:00:00'),
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Count',
            'period_end_date' => null,
            'period_end_count' => 3
        ]);
    }
}
