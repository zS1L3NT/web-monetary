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
        'period_month_day_of',
        'period_end_type',
        'period_end_date',
        'period_end_count',
    ];

    protected $casts = [
        'amount' => 'integer',
        'automatic' => 'boolean',
        'period_start_date' => 'date',
        'period_week_days' => 'array',
        'period_interval' => 'integer',
        'period_end_date' => 'date',
        'period_end_count' => 'integer',
    ];

    public function setTypeAttribute(string $type)
    {
        switch ($type) {
            case "Transfer":
                if ($this->from_account_id === null && $this->to_account_id === null) {
                    throw new \Exception("Transfer recurrences must have a from_account_id or a to_account_id");
                }
                break;
            case "Incoming":
            case "Outgoing":
                if ($this->from_account_id === null) {
                    throw new \Exception("Non-transfer recurrences must not have a null from_account_id");
                }
                $this->attributes['to_account_id'] = null;
                break;
        }
        $this->attributes['type'] = $type;
    }

    public function setFromAccountIdAttribute(string|null $fromAccountId)
    {
        switch ($this->type) {
            case "Transfer":
                if ($fromAccountId === null && $this->to_account_id === null) {
                    throw new \Exception("Transfer recurrences must have a from_account_id or a to_account_id");
                }
                break;
            case "Incoming":
            case "Outgoing":
                if ($fromAccountId === null) {
                    throw new \Exception("Non-transfer recurrences must not have a null from_account_id");
                }
                $this->attributes['to_account_id'] = null;
                break;
        }
        $this->attributes['from_account_id'] = $fromAccountId;
    }

    public function setToAccountIdAttribute(string|null $toAccountId)
    {
        switch ($this->type) {
            case "Transfer":
                if ($this->from_account_id === null && $toAccountId === null) {
                    throw new \Exception("Transfer recurrences must have a from_account_id or a to_account_id");
                }
                break;
            case "Incoming":
            case "Outgoing":
                if ($toAccountId !== null) {
                    throw new \Exception("Non-transfer recurrences must not have a to_account_id");
                }
                break;
        }
        $this->attributes['to_account_id'] = $toAccountId;
    }

    public function setPeriodTypeAttribute(string $periodType)
    {
        if ($periodType !== "Week") {
            $this->attributes['period_week_days'] = null;
        }

        if ($periodType !== "Month") {
            $this->attributes['period_month_day_of'] = null;
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
