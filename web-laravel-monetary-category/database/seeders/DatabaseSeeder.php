<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Symfony\Component\Console\Output\ConsoleOutput;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->makeCategoryWithSubcategories("Food & Drinks", "#f44336", [
            "Meals" => [
                "Breakfast",
                "Lunch",
                "Dinner"
            ],
            "Snacks" => [
                "Drinks",
                "Sweets",
                "Food"
            ]
        ]);

        $this->makeCategoryWithSubcategories("Shopping", "#4fc3f7", [
            "Clothes & shoes",
            "Electronics",
        ]);

        $this->makeCategoryWithSubcategories("Transport", "#7890c9", [
            "Public Transport",
            "Grab"
        ]);

        $this->makeCategoryWithSubcategories("Life", "#64dd17", [
            "IU",
            "Entertainment" => [
                "8 Ball Pool",
                "Bowling",
                "Movie",
                "Arcade"
            ],
            "Red Packets",
            "Gifts",
            "Health care"
        ]);

        $this->makeCategoryWithSubcategories("Software", "#1565c0", [
            "Spotify",
            "Programming",
            "Games",
            "Google One"
        ]);

        $this->makeCategoryWithSubcategories("Others", "#9e9e9e", [
            "Missing"
        ]);
    }

    public function makeCategoryWithSubcategories(string $name, string $color, array $subcategories = []): Category
    {
        $subcategory_ids = [];
        foreach ($subcategories as $key => $value) {
            if (gettype($key) === "integer") {
                $subcategory_ids[] = $this->makeCategoryWithSubcategories($value, $color, [])->id;
            } else {
                $subcategory_ids[] = $this->makeCategoryWithSubcategories($key, $color, $value)->id;
            }
        }

        $category = Category::factory()->create([
            'name' => $name,
            'color' => $color
        ]);

        if (count($subcategory_ids) > 0) {
            $category->category_ids = $subcategory_ids;
        }

        return $category;
    }
}
