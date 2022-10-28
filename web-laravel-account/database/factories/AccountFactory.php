<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => User::query()->first()->id,
            'name' => $this->faker->name,
            'balance' => $this->faker->randomFloat(2, 0, 100000),
            'color' => $this->faker->hexColor,
        ];
    }
}
