<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurrence extends Model
{
    use HasFactory, Uuid {
        boot as public uuidboot;
    }

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
        'period_end_type',
        'period_end_date',
        'period_end_count',
        'transaction_ids',
    ];

    protected $casts = [
        'amount' => 'double',
        'automatic' => 'boolean',
        'period_start_date' => 'datetime',
        'period_interval' => 'integer',
        'period_end_date' => 'datetime',
        'period_end_count' => 'integer',
    ];

    protected $appends = [
        'transaction_ids'
    ];

    protected $hidden = [
        'user_id',
    ];

    public static function boot() {
        static::uuidboot();
        static::saving(function ($model) {
            if ($model->type === "Transfer" && $model->to_account_id === null) {
                throw new \Exception("Transfer must have a to_account_id");
            }
            if ($model->type !== "Transfer" && $model->to_account_id !== null) {
                throw new \Exception("Non-transfer must not have a to_account_id");
            }
        });
    }

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