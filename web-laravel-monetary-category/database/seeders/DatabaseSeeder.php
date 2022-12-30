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
        $meals_category = Category::factory()->create(['name' => 'Meals']);
        $meals_category->category_ids = [
            Category::factory()->create(['name' => 'Breakfast'])->id,
            Category::factory()->create(['name' => 'Lunch'])->id,
            Category::factory()->create(['name' => 'Dinner'])->id,
        ];

        $transport_category = Category::factory()->create(['name' => 'Transport']);
        $transport_category->category_ids = [
            Category::factory()->create(['name' => 'Concession'])->id,
            Category::factory()->create(['name' => 'Grab'])->id,
        ];
    }
}