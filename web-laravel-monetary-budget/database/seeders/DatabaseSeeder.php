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
        Budget::factory(1)->create();
    }
}
