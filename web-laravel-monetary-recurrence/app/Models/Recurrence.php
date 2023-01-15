<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurrence extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'category_id',
        'from_account_id',
        'to_account_id',
        'type',
        'name',
        'amount',
        'description',
        'automatic',
        'period_start_date',
        'period_type',
        'period_interval',
        'period_week_days',
        'period_end_type',
        'period_end_date',
        'period_end_count',
    ];

    protected $casts = [
        'amount' => 'double',
        'automatic' => 'boolean',
        'period_start_date' => 'date',
        'period_interval' => 'integer',
        'period_end_date' => 'date',
        'period_end_count' => 'integer',
    ];

    protected $appends = [
        'transaction_ids'
    ];

    public function getTransactionIdsAttribute()
    {
        return RecurrenceTransactions::query()->where('recurrence_id', $this->id)->pluck('transaction_id')->toArray();
    }

    public function setTransactionIdsAttribute(array $transactionIds)
    {
        RecurrenceTransactions::query()->whereIn("transaction_id", $transactionIds)->delete();
        foreach ($transactionIds as $transactionId) {
            RecurrenceTransactions::query()->create([
                'recurrence_id' => $this->id,
                'transaction_id' => $transactionId
            ]);
        }
    }

    public function setTypeAttribute(string $type)
    {
        if (array_key_exists('to_account_id', $this->attributes)) {
            if ($type === "Transfer" && $this->to_account_id === null) {
                throw new \Exception("Recurrence must have a to_account_id");
            }
            if ($type !== "Transfer" && $this->to_account_id !== null) {
                throw new \Exception("Non-transfer recurrences must not have a to_account_id");
            }
        }
        $this->attributes['type'] = $type;
    }

    public function setToAccountIdAttribute(string|null $toAccountId)
    {
        if (array_key_exists('type', $this->attributes)) {
            if ($this->type === "Transfer" && $toAccountId === null) {
                throw new \Exception("Recurrence must have a to_account_id");
            }
            if ($this->type !== "Transfer" && $toAccountId !== null) {
                throw new \Exception("Non-transfer recurrences must not have a to_account_id");
            }
        }
        $this->attributes['to_account_id'] = $toAccountId;
    }

    public function setPeriodTypeAttribute(string $periodType)
    {
        if ($periodType !== "Week") {
            $this->attributes['period_week_days'] = null;
        }

        $this->attributes['period_type'] = $periodType;
    }

    public function setPeriodEndTypeAttribute(string $periodEndType)
    {
        if ($periodEndType !== 'Date') {
            $this->attributes['period_end_date'] = null;
        }

        if ($periodEndType !== 'Count') {
            $this->attributes['period_end_count'] = null;
        }

        $this->attributes['period_end_type'] = $periodEndType;
    }
}