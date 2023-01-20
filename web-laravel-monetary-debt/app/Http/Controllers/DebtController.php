<?php

namespace App\Http\Controllers;

use App\Models\Debt;

class DebtController extends Controller
{
    public function __construct() {
        $this->middleware('owns.debt')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'type' => 'required|in:Lend,Borrow',
            'amount' => 'required|decimal:0,2',
            'due_date' => 'required|date',
            'name' => 'required|string',
            'description' => 'string',
            'active' => 'boolean',
            'transaction_ids' => 'array',
            'transaction_ids.*' => 'uuid|exists:transactions,id|distinct'
        ]);

        $this->validate('update', [
            'type' => 'in:Lend,Borrow',
            'amount' => 'decimal:0,2',
            'due_date' => 'date',
            'name' => 'string',
            'description' => 'string',
            'active' => 'boolean',
            'transaction_ids' => 'array',
            'transaction_ids.*' => 'uuid|exists:transactions,id|distinct'
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
