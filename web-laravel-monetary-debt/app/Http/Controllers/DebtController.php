<?php

namespace App\Http\Controllers;

use App\Models\Debt;

class DebtController extends Controller
{
    public function __construct() {
        $this->middleware('owns.debt')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'type' => 'required|in:Loan,Debt',
            'amount' => 'required|decimal:0,2',
            'description' => 'string',
            'active' => 'boolean',
            'transaction_ids' => 'required|array',
            'transaction_ids.*' => 'uuid|exists:transactions,id|distinct'
        ]);

        $this->validate('update', [
            'type' => 'in:Loan,Debt',
            'amount' => 'decimal:0,2',
            'description' => 'string',
            'active' => 'boolean',
            'transaction_ids' => 'array',
            'transaction_ids.*' => 'uuid|exists:transactions,id|distinct'
        ]);
    }

    public function index()
    {
        $query = Debt::query()
            ->where('user_id', request('user_id'))
            ->orderBy('type', 'desc');

        if ($active = request('active')) {
            switch (strtolower($active)) {
                case "true":
                    $query->where('active', true);
                    break;
                case "false":
                    $query->where('active', false);
                    break;
                default:
                    return response([
                        'message' => 'Invalid value for active parameter. Must be true or false.',
                    ], 400);
            }
        }

        return $query->get();
    }

    public function store()
    {
        $debt = Debt::query()->create(request()->all());

        return [
            'message' => 'Debt created successfully!',
            'debt' => $debt,
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
            'debt' => $debt,
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
