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
        return [
            'user_id' => DB::table('users')->first()->id,
            'name' => $this->faker->word,
            'amount' => $this->faker->numberBetween(100, 1000),
            'period_type' => $this->faker->randomElement(['Day', 'Week', 'Month', 'Year']),
        ];
    }
}
