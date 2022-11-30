<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::factory()->create([
            'name' => 'Meals',
            'category_ids' => [
                Category::factory()->create([
                    'name' => 'Breakfast',
                ])->id,
                Category::factory()->create([
                    'name' => 'Lunch',
                ])->id,
                Category::factory()->create([
                    'name' => 'Dinner',
                ])->id,
            ],
        ]);

        Category::factory()->create([
            'name' => 'Transport',
            'category_ids' => [
                Category::factory()->create([
                    'name' => 'Concession',
                ])->id,
                Category::factory()->create([
                    'name' => 'Grab',
                ])->id,
            ],
        ]);
    }
}
