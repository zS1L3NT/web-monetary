<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\BudgetAccounts;
use App\Models\BudgetCategories;

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
            'account_ids.*' => 'uuid|exists:accounts,id|distinct',
            'category_ids' => 'required|array',
            'category_ids.*' => 'uuid|exists:categories,id|distinct',
        ]);

        $this->validate('update', [
            'name' => 'string',
            'amount' => 'numeric',
            'period_type' => 'in:Day,Week,Month,Year',
            'account_ids' => 'array',
            'account_ids.*' => 'uuid|exists:accounts,id|distinct',
            'category_ids' => 'array',
            'category_ids.*' => 'uuid|exists:categories,id|distinct',
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

        return [
            "message" => "Budget created successfully!",
            "budget" => $budget,
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
            "budget" => $budget,
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
