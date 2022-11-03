<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'name',
        'amount',
        'period_type',
    ];

    protected $casts = [
        'amount' => 'integer',
    ];
}
