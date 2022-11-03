<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Database\QueryException;

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
            ->where('user_id', request('user_id'))
            ->whereNull('parent_category_id')
            ->get()
            ->map(function ($category) {
                return $this->getNestedCategory($category);
            });
    }

    public function store()
    {
        $category = Category::query()->create(request()->all());

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
        try {
            $category->delete();
        } catch (QueryException $e) {
            if ($e->errorInfo[1] === 1451) {
                if (str_contains($e->getMessage(), "recurrence")) {
                    return response([
                        "type" => "Recurrences associated with this category exist",
                        "message" => "You cannot delete a category that has recurrences associated with it.",
                    ], 400);
                }

                if (str_contains($e->getMessage(), "transaction")) {
                    return response([
                        "type" => "Transactions associated with this category exist",
                        "message" => "You cannot delete a category that has transactions associated with it.",
                    ], 400);
                }

                return response([
                    "type" => "Uncaught Foreign Key Constraint",
                    "message" => $e->getMessage(),
                ], 400);
            } else {
                throw $e;
            }
        }

        return [
            "message" => "Category deleted successfully!",
        ];
    }
}
