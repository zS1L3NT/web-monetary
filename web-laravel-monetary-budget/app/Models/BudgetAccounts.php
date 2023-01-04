<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetAccounts extends Model
{
    public $timestamps = false;

    public $primaryKey = null;

    public $incrementing = false;

    protected $fillable = [
        'budget_id',
        'account_id',
    ];
}
