<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebtTransactions extends Model
{
    public $timestamps = false;

    public $primaryKey = null;

    public $incrementing = false;

    protected $fillable = [
        'debt_id',
        'transaction_id',
    ];
}
