<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'description',
        'active',
    ];

    protected $casts = [
        'amount' => 'integer',
        'active' => 'boolean',
    ];
}
