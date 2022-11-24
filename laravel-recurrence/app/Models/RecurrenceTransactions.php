<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurrenceTransactions extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'recurrence_id',
        'transaction_id',
    ];
}
