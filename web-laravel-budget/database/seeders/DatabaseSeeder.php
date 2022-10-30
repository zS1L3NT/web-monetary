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
        $budget = Budget::factory(1)->create()->first();
        foreach (DB::table('accounts')->where('user_id', $budget->user_id)->get() as $account) {
            /** @var object $account */
            BudgetAccounts::create([
                'budget_id' => $budget->id,
                'account_id' => $account->id,
            ]);
        }
        foreach (DB::table('categories')->where('user_id', $budget->user_id)->get() as $category) {
            /** @var object $category */
            BudgetCategories::create([
                'budget_id' => $budget->id,
                'category_id' => $category->id,
            ]);
        }
    }
}
