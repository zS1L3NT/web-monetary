<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Debt>
 */
class DebtFactory extends Factory
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
            'type' => $this->faker->randomElement(['Lend', 'Borrow']),
            'amount' => $this->faker->randomFloat(2, 0, 1000),
            'description' => $this->faker->sentence,
            'active' => $this->faker->boolean,
            'transaction_ids' => []
        ];
    }
}
