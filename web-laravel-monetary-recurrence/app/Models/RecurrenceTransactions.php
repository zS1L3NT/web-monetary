<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurrenceTransactions extends Model
{
    public $timestamps = false;

    public $primaryKey = null;

    public $incrementing = false;

    protected $fillable = [
        'recurrence_id',
        'transaction_id',
    ];
}
