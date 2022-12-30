<?php

namespace Database\Seeders;

use App\Models\Budget;
use App\Models\BudgetAccounts;
use App\Models\BudgetCategories;
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
        $userId = DB::table('users')->first()->id;

        $budget = Budget::factory(1)->create();
        $budget->account_ids = DB::table('accounts')->where('user_id', $userId)->pluck('id')->toArray();
        $budget->category_ids = DB::table('categories')->where('user_id', $userId)->pluck('id')->toArray();
    }
}
