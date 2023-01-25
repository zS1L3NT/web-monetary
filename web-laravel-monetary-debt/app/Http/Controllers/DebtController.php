<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use Illuminate\Validation\Rule;

class DebtController extends Controller
{
    public function __construct() {
        $this->middleware('owns.debt')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'type' => 'required|in:Lend,Borrow',
            'amount' => 'required|numeric',
            'due_date' => 'required|date',
            'name' => 'required|string',
            'description' => 'string',
            'active' => 'boolean',
            'transaction_ids' => 'array',
            'transaction_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('transactions', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ]
        ]);

        $this->validate('update', [
            'type' => 'in:Lend,Borrow',
            'amount' => 'numeric',
            'due_date' => 'date',
            'name' => 'string',
            'description' => 'string',
            'active' => 'boolean',
            'transaction_ids' => 'array',
            'transaction_ids.*' => [
                'uuid',
                'distinct',
                Rule::exists('transactions', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ]
        ]);
    }

    public function index()
    {
        return Debt::query()
            ->where('user_id', request('user_id'))
            ->orderBy('type', 'desc')
            ->get();
    }

    public function store()
    {
        $debt = Debt::query()->create(request()->all());
        $debt->transaction_ids = request('transaction_ids');

        return [
            'message' => 'Debt created successfully!',
            'id' => $debt->id,
        ];
    }

    public function show(Debt $debt)
    {
        return $debt;
    }

    public function update(Debt $debt)
    {
        $debt->update(request()->all());

        return [
            'message' => 'Debt updated successfully!',
        ];
    }

    public function destroy(Debt $debt)
    {
        $debt->delete();

        return [
            'message' => 'Debt deleted successfully!',
        ];
    }
}
