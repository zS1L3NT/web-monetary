<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
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
        $periodType = $this->faker->randomElement(['Day', 'Week', 'Month', 'Year']);
        $periodEndType = $this->faker->randomElement(['Never', 'Date', 'Count']);

        return [
            'user_id' => DB::table('users')->first()->id,
            'category_id' => DB::table('categories')->inRandomOrder()->first()->id,
            'from_account_id' => $fromAccountId,
            'to_account_id' => $type === 'Transfer' ? DB::table('accounts')->whereNot('id', $fromAccountId)->inRandomOrder()->first()->id : null,
            'type' => $type,
            'name' => $this->faker->word,
            'amount' => $this->faker->randomFloat(2, 0, 100000),
            'description' => $this->faker->sentence,
            'automatic' => $this->faker->boolean,
            'period_start_date' => $this->faker->date(),
            'period_type' => $periodType,
            'period_interval' => $this->faker->numberBetween(1, 4),
            'period_week_days' => $periodType === 'Week' ? json_encode($this->faker->randomElements(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], $this->faker->numberBetween(1, 7))) : null,
            'period_month_day_of' => $periodType === 'Month' ? $this->faker->randomElement(['Month', 'Week Day']) : null,
            'period_end_type' => $this->faker->randomElement(['Never', 'Date', 'Count']),
            'period_end_date' => $periodEndType === 'Date' ? $this->faker->date() : null,
            'period_end_count' => $periodEndType === 'Count' ? $this->faker->numberBetween(1, 10) : null,
        ];
    }
}
