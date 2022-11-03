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
        $meals_category_id = Category::factory()->create([
            'name' => 'Meals'
        ])->id;
        Category::factory()->create([
            'parent_category_id' => $meals_category_id,
            'name' => 'Breakfast',
        ]);
        Category::factory()->create([
            'parent_category_id' => $meals_category_id,
            'name' => 'Lunch',
        ]);
        Category::factory()->create([
            'parent_category_id' => $meals_category_id,
            'name' => 'Dinner',
        ]);

        $transport_category_id = Category::factory()->create([
            'name' => 'Transport'
        ])->id;
        Category::factory()->create([
            'parent_category_id' => $transport_category_id,
            'name' => 'Concession',
        ]);
        Category::factory()->create([
            'parent_category_id' => $transport_category_id,
            'name' => 'Grab',
        ]);
    }
}
