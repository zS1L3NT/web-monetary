<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.category')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'name' => 'required|string',
            'color' => 'required|string',
            'category_ids' => 'array',
            'category_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('categories', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ]
        ]);

        $this->validate('update', [
            'name' => 'string',
            'color' => 'string',
            'category_ids' => 'array',
            'category_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('categories', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ]
        ]);
    }

    public function index()
    {
        return Category::query()
            ->where('user_id', request('user_id'))
            ->get();
    }

    public function store()
    {
        $category = Category::query()->create(request()->all());
        $category->category_ids = request('category_ids');

        return [
            "message" => "Category created successfully!",
            "id" => $category->id,
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
        ];
    }

    public function destroy(Category $category)
    {
        try {
            $category->delete();
        } catch (QueryException $e) {
            if (str_contains($e->getMessage(), "Foreign key violation")) {
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