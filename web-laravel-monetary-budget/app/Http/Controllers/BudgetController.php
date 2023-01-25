<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Validation\Rule;

class BudgetController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.budget')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'period_type' => 'required|in:Day,Week,Month,Year',
            'account_ids' => 'required|array',
            'account_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('accounts', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'category_ids' => 'required|array',
            'category_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('categories', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
        ]);

        $this->validate('update', [
            'name' => 'string',
            'amount' => 'numeric',
            'period_type' => 'in:Day,Week,Month,Year',
            'account_ids' => 'array',
            'account_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('accounts', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'category_ids' => 'array',
            'category_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('categories', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
        ]);
    }

    public function index()
    {
        return Budget::query()
            ->where('user_id', request('user_id'))
            ->orderBy('name')
            ->get();
    }

    public function store()
    {
        $budget = Budget::query()->create(request()->all());
        $budget->account_ids = request('account_ids');
        $budget->category_ids = request('category_ids');

        return [
            "message" => "Budget created successfully!",
            "id" => $budget->id,
        ];
    }

    public function show(Budget $budget)
    {
        return $budget;
    }

    public function update(Budget $budget)
    {
        $budget->update(request()->all());

        return [
            "message" => "Budget updated successfully!",
        ];
    }

    public function destroy(Budget $budget)
    {
        $budget->delete();

        return [
            "message" => "Budget deleted successfully!",
        ];
    }
}