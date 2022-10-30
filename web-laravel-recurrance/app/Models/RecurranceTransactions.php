<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurranceTransactions extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'recurrance_id',
        'transaction_id',
    ];
}
