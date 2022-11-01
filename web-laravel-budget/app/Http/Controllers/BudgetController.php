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

        foreach (request('account_ids') as $account_id) {
            BudgetAccounts::query()->create([
                'budget_id' => $budget->id,
                'account_id' => $account_id,
            ]);
        }

        foreach (request('category_ids') as $category_id) {
            BudgetCategories::query()->create([
                'budget_id' => $budget->id,
                'category_id' => $category_id,
            ]);
        }

        return [
            "message" => "Budget created successfully!",
            "budget" => [
                ...$budget->toArray(),
                'account_ids' => request('account_ids'),
                'category_ids' => request('category_ids')
            ],
        ];
    }

    public function show(Budget $budget)
    {
        return [
            ...$budget->toArray(),
            "account_ids" => BudgetAccounts::query()
                ->where('budget_id', $budget->id)
                ->pluck('account_id'),
            "category_ids" => BudgetCategories::query()
                ->where('budget_id', $budget->id)
                ->pluck('category_id'),
        ];
    }

    public function update(Budget $budget)
    {
        $budget->update(request()->all());

        if ($account_ids = request('account_ids')) {
            BudgetAccounts::where('budget_id', $budget->id)->delete();
            foreach ($account_ids as $account_id) {
                BudgetAccounts::query()->create([
                    'budget_id' => $budget->id,
                    'account_id' => $account_id,
                ]);
            }
        }

        if ($category_ids = request('category_ids')) {
            BudgetCategories::where('budget_id', $budget->id)->delete();
            foreach ($category_ids as $category_id) {
                BudgetCategories::query()->create([
                    'budget_id' => $budget->id,
                    'category_id' => $category_id,
                ]);
            }
        }

        return [
            "message" => "Budget updated successfully!",
            "budget" => [
                ...$budget->toArray(),
                "account_ids" => BudgetAccounts::query()
                    ->where('budget_id', $budget->id)
                    ->pluck('account_id'),
                "category_ids" => BudgetCategories::query()
                    ->where('budget_id', $budget->id)
                    ->pluck('category_id'),
            ],
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
