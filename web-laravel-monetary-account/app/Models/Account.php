<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Account extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'name',
        'initial_balance',
        'color',
    ];

    protected $casts = [
        'initial_balance' => 'integer',
    ];

    protected $appends = [
        'balance',
    ];

    public function getBalanceAttribute()
    {
        return $this->initial_balance + array_sum(array_map(fn($transaction) => $transaction->amount, [
            ...DB::table('transactions')
                ->where('user_id', request('user_id'))
                ->where('from_account_id', $this->id)
                ->get(),
            ...DB::table('transactions')
                ->where('user_id', request('user_id'))
                ->where('type', 'Transfer')
                ->where('to_account_id', $this->id)
                ->get()
        ]));
    }
}
