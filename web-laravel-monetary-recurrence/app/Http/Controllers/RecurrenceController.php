<?php

namespace App\Http\Controllers;

use App\Models\Recurrence;

class RecurrenceController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.recurrence')->only(['show', 'update', 'delete']);

        $this->validate('store', [
            'category_id' => 'required|uuid|exists:categories,id',
            'from_account_id' => 'required|uuid|exists:accounts,id',
            'to_account_id' => 'nullable|uuid|exists:accounts,id',
            'type' => 'required|in:Incoming,Outgoing,Transfer',
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'string',
            'automatic' => 'required|boolean',
            'period_start_date' => 'required|date',
            'period_type' => 'required|in:Day,Week,Month,Year',
            'period_interval' => 'required|integer',
            'period_end_type' => 'required|in:Never,Date,Count',
            'period_end_date' => 'nullable|date',
            'period_end_count' => 'nullable|integer',
            'transaction_ids' => 'array',
            'transaction_ids.*' => 'uuid|exists:transactions,id|distinct'
        ]);

        $this->validate('update', [
            'category_id' => 'uuid|exists:categories,id',
            'from_account_id' => 'uuid|exists:accounts,id',
            'to_account_id' => 'uuid|exists:accounts,id',
            'type' => 'in:Incoming,Outgoing,Transfer',
            'name' => 'string',
            'amount' => 'numeric',
            'description' => 'string',
            'automatic' => 'boolean',
            'period_start_date' => 'date',
            'period_type' => 'in:Day,Week,Month,Year',
            'period_interval' => 'integer',
            'period_end_type' => 'in:Never,Date,Count',
            'period_end_date' => 'nullable|date',
            'period_end_count' => 'nullable|integer',
            'transaction_ids' => 'array',
            'transaction_ids.*' => 'uuid|exists:transactions,id|distinct'
        ]);
    }

    public function index()
    {
        return Recurrence::query()
            ->where('user_id', request('user_id'))
            ->orderBy('name')
            ->get();
    }

    public function store()
    {
        $recurrence = Recurrence::query()->create(request()->all());

        return [
            "message" => "Recurrence created successfully!",
            "id" => $recurrence->id,
        ];
    }

    public function show(Recurrence $recurrence)
    {
        return $recurrence;
    }

    public function update(Recurrence $recurrence)
    {
        $recurrence->update(request()->all());

        return [
            "message" => "Recurrence updated successfully!",
        ];
    }

    public function destroy(Recurrence $recurrence)
    {
        $recurrence->delete();

        return [
            "message" => "Recurrence deleted successfully!",
        ];
    }
}
