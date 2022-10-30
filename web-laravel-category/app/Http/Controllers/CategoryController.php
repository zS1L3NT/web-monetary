<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    public function __construct() {
        $this->middleware('owns.category')->only(['show', 'update', 'delete']);

        $this->validate('store', [
            'parent_category_id' => 'exists:categories,id',
            'name' => 'required|string',
            'color' => 'required|string',
        ]);

        $this->validate('update', [
            'parent_category_id' => 'exists:categories,id',
            'name' => 'string',
            'color' => 'string',
        ]);
    }

    public function index()
    {
        return Category::query()->where('user_id', request()->user_id)->get();
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
        return $category;
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
