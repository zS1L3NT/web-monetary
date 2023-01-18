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
        'initial_balance' => 'double',
    ];

    protected $appends = [
        'balance',
    ];

    protected $hidden = [
        'user_id',
    ];

    public function getBalanceAttribute()
    {
        return round($this->initial_balance
            + array_sum([
                ...DB::table('transactions')
                    ->where('user_id', request('user_id'))
                    ->where('type', 'Incoming')
                    ->where('from_account_id', $this->id)
                    ->pluck('amount'),
                ...DB::table('transactions')
                    ->where('user_id', request('user_id'))
                    ->where('type', 'Transfer')
                    ->where('to_account_id', $this->id)
                    ->pluck('amount')
            ])
            - array_sum([
                ...DB::table('transactions')
                    ->where('user_id', request('user_id'))
                    ->where('type', 'Outgoing')
                    ->where('from_account_id', $this->id)
                    ->pluck('amount'),
                ...DB::table('transactions')
                    ->where('user_id', request('user_id'))
                    ->where('type', 'Transfer')
                    ->where('from_account_id', $this->id)
                    ->pluck('amount')
            ]), 2);
    }
}