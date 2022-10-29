<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
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
            'parent_category_id' => $this->faker->randomElement([null, DB::table('categories')->inRandomOrder()->first()->id]),
            'name' => $this->faker->word,
            'color' => $this->faker->hexColor,
        ];
    }
}
