<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.category')->only(['show', 'update', 'delete']);

        $this->validate('store', [
            'parent_category_id' => 'uuid|exists:categories,id',
            'name' => 'required|string',
            'color' => 'required|string',
        ]);

        $this->validate('update', [
            'parent_category_id' => 'uuid|exists:categories,id',
            'name' => 'string',
            'color' => 'string',
        ]);
    }

    private function getNestedCategory(Category $category)
    {
        return [
            ...$category->toArray(),
            "categories" => Category::query()
                ->where("parent_category_id", $category->id)
                ->get()
                ->map(function ($category) {
                    return $this->getNestedCategory($category);
                }),
        ];
    }

    public function index()
    {
        return Category::query()
            ->where('user_id', request()->user_id)
            ->whereNull('parent_category_id')
            ->get()
            ->map(function ($category) {
                return $this->getNestedCategory($category);
            });
    }

    public function store()
    {
        $category = Category::create([
            'user_id' => request()->user_id,
            ...request()->all(),
        ]);

        return [
            "message" => "Category created successfully!",
            "category" => $category,
        ];
    }

    public function show(Category $category)
    {
        return $this->getNestedCategory($category);
    }

    public function update(Category $category)
    {
        $category->update(request()->all());

        return [
            "message" => "Category updated successfully!",
            "category" => $category,
        ];
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return [
            "message" => "Category deleted successfully!",
        ];
    }
}
