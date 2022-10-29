<?php

namespace App\Http\Controllers;

use App\Models\Recurrance;

class RecurranceController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.recurrance')->only(['show', 'update', 'delete']);

        $this->validate('store', [
            'category_id' => 'required|exists:categories,id',
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required_if:type,Transfer|prohibited_unless:type,Transfer|exists:accounts,id',
            'type' => 'required|in:Incoming,Outgoing,Transfer',
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'string',
            'automatic' => 'boolean',
            'period_start_date' => 'required|date',
            'period_type' => 'required|in:Day,Week,Month,Year',
            'period_interval' => 'required|integer',
            'period_week_days' => 'required_if:period_type,Week|prohibited_unless:period_type,Week|array',
            'period_week_days.*' => 'in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday|distinct',
            'period_month_day_of' => 'required_if:period_type,Week|prohibited_unless:period_type,Week|in:Month,Week Day',
            'period_end_type' => 'required|in:Never,Date,Count',
            'period_end_date' => 'required_if:period_end_type,Date|prohibited_unless:period_end_type,Date|date',
            'period_end_count' => 'required_if:period_end_type,Count|prohibited_unless:period_end_type,Count|integer',
        ]);

        $this->validate('update', [
            'category_id' => 'exists:categories,id',
            'from_account_id' => 'exists:accounts,id',
            'to_account_id' => 'required_if:type,Transfer|prohibited_unless:type,Transfer|exists:accounts,id',
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
        ]);
    }

    public function index()
    {
        return Recurrance::query()->where('user_id', request()->user_id)->get();
    }

    public function store()
    {
        $recurrance = Recurrance::create([
            'user_id' => request()->user_id,
            ...request()->all(),
        ]);

        return [
            "message" => "Recurrance created successfully!",
            "recurrance" => $recurrance,
        ];
    }

    public function show(Recurrance $recurrance)
    {
        return $recurrance;
    }

    public function update(Recurrance $recurrance)
    {
        $recurrance->update(request()->all());

        return [
            "message" => "Recurrance updated successfully!",
            "recurrance" => $recurrance,
        ];
    }

    public function destroy(Recurrance $recurrance)
    {
        $recurrance->delete();

        return [
            "message" => "Recurrance deleted successfully!",
        ];
    }
}
