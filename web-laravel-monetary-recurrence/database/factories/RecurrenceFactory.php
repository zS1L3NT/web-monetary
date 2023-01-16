<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recurrence>
 */
class RecurrenceFactory extends Factory
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
        $periodStartDate = Carbon::now()->setMillis(0)->setSeconds(0)->setMinutes(0)->setHours(0);
        $periodEndType = $this->faker->randomElement(['Never', 'Date', 'Count']);

        return [
            'user_id' => DB::table('users')->first()->id,
            'category_id' => DB::table('categories')->inRandomOrder()->first()->id,
            'from_account_id' => $fromAccountId,
            'to_account_id' => $type === 'Transfer' ? DB::table('accounts')->whereNot('id', $fromAccountId)->inRandomOrder()->first()->id : null,
            'type' => $type,
            'name' => $this->faker->word,
            'amount' => $this->faker->randomFloat(2, 0, 1000),
            'description' => $this->faker->sentence,
            'automatic' => $this->faker->boolean,
            'period_start_date' => $periodStartDate,
            'period_type' => $this->faker->randomElement(['Day', 'Week', 'Month', 'Year']),
            'period_interval' => $this->faker->numberBetween(1, 4),
            'period_end_type' => $periodEndType,
            'period_end_date' => $periodEndType === 'Date' ? $periodStartDate->addMonths($this->faker->numberBetween(12, 120)) : null,
            'period_end_count' => $periodEndType === 'Count' ? $this->faker->numberBetween(10, 100) : null,
            'transaction_ids' => []
        ];
    }
}