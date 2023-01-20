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
        'due_date',
        'name',
        'description',
        'active',
        'transaction_ids',
    ];

    protected $casts = [
        'amount' => 'double',
        'due_date' => 'datetime',
        'active' => 'boolean',
    ];

    protected $appends = [
        'transaction_ids'
    ];

    protected $hidden = [
        'user_id',
    ];

    public function getTransactionIdsAttribute()
    {
        return DebtTransactions::query()->where('debt_id', $this->id)->pluck('transaction_id')->toArray();
    }

    public function setTransactionIdsAttribute(array $transactionIds)
    {
        DebtTransactions::query()->whereIn("transaction_id", $transactionIds)->delete();
        foreach ($transactionIds as $transactionId) {
            DebtTransactions::query()->create([
                'debt_id' => $this->id,
                'transaction_id' => $transactionId
            ]);
        }
    }
}