<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurrance extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'category_id',
        'from_account_id',
        'to_account_id',
        'type',
        'name',
        'amount',
        'description',
        'automatic',
        'period_start_date',
        'period_type',
        'period_interval',
        'period_week_days',
        'period_month_day_of',
        'period_end_type',
        'period_end_date',
        'period_end_count',
    ];
}
