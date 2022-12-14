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
            'from_account_id' => 'required_unless:type,Transfer|uuid|exists:accounts,id',
            'to_account_id' => 'required_if:from_account_id,null|prohibited_unless:type,Transfer|uuid|exists:accounts,id',
            'type' => 'required|in:Incoming,Outgoing,Transfer',
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'string',
            'automatic' => 'required|boolean',
            'period_start_date' => 'required|date',
            'period_type' => 'required|in:Day,Week,Month,Year',
            'period_interval' => 'required|integer',
            'period_week_days' => 'required_if:period_type,Week|prohibited_unless:period_type,Week|array',
            'period_week_days.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday|distinct',
            'period_month_day_of' => 'required_if:period_type,Week|prohibited_unless:period_type,Week|in:Month,Week Day',
            'period_end_type' => 'required|in:Never,Date,Count',
            'period_end_date' => 'required_if:period_end_type,Date|prohibited_unless:period_end_type,Date|date',
            'period_end_count' => 'required_if:period_end_type,Count|prohibited_unless:period_end_type,Count|integer',
            'transaction_ids' => 'required|array',
            'transaction_ids.*' => 'uuid|exists:transaction,id|distinct'
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
            'period_week_days' => 'required_if:period_type,Week|prohibited_unless:period_type,Week|array',
            'period_week_days.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday|distinct',
            'period_month_day_of' => 'required_if:period_type,Month|prohibited_unless:period_type,Month|in:Month,Week Day',
            'period_end_type' => 'in:Never,Date,Count',
            'period_end_date' => 'required_if:period_end_type,Date|prohibited_unless:period_end_type,Date|date',
            'period_end_count' => 'required_if:period_end_type,Count|prohibited_unless:period_end_type,Count|integer',
            'transaction_ids' => 'array',
            'transaction_ids.*' => 'uuid|exists:transaction,id|distinct'
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
            "recurrence" => $recurrence,
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
            "recurrence" => $recurrence,
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
