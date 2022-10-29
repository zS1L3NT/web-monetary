<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $type = $this->faker->randomElement(['Incoming', 'Outgoing', 'Transfer']);
        $fromAccountId = DB::table('accounts')->inRandomOrder()->first()->id;

        return [
            'user_id' => DB::table('users')->first()->id,
            'category_id' => DB::table('categories')->inRandomOrder()->first()->id,
            'from_account_id' => $fromAccountId,
            'to_account_id' => $type === 'Transfer' ? DB::table('accounts')->whereNot('id', $fromAccountId)->inRandomOrder()->first()->id : null,
            'type' => $type,
            'amount' => $this->faker->randomFloat(2, 0, 1000),
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'description' => $this->faker->sentence,
        ];
    }
}
