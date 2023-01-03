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
        'amount' => 'double',
        'active' => 'boolean',
    ];

    protected $appends = [
        'transaction_ids'
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