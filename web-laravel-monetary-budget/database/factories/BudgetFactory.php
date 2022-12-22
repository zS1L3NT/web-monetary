<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Budget>
 */
class BudgetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $userId = DB::table('users')->first()->id;

        return [
            'user_id' => $userId,
            'name' => $this->faker->word,
            'amount' => $this->faker->numberBetween(100, 1000),
            'period_type' => $this->faker->randomElement(['Day', 'Week', 'Month', 'Year']),
            'account_ids' => DB::table('accounts')->where('user_id', $userId)->pluck('id')->toArray(),
            'category_ids' => DB::table('categories')->where('user_id', $userId)->pluck('id')->toArray(),
        ];
    }
}
