<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurrance extends Model
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

    public function setTypeAttribute(string $type) {
        if ($type === "Transfer") {
            if ($this->from_account_id === null && $this->to_account_id === null) {
                throw new \Exception("Transfer transactions must have a from_account_id or a to_account_id");
            }
        } else {
            if ($this->from_account_id === null) {
                throw new \Exception("Non-transfer transactions must not have a null from_account_id");
            }
            $this->attributes['to_account_id'] = null;
        }
        $this->attributes['type'] = $type;
    }

    public function setFromAccountIdAttribute(string|null $fromAccountId) {
        if ($this->type === "Transfer") {
            if ($fromAccountId === null && $this->to_account_id === null) {
                throw new \Exception("Transfer transactions must have a from_account_id or a to_account_id");
            }
        } else {
            if ($fromAccountId === null) {
                throw new \Exception("Non-transfer transactions must not have a null from_account_id");
            }
            $this->attributes['to_account_id'] = null;
        }
        $this->attributes['from_account_id'] = $fromAccountId;
    }

    public function setToAccountIdAttribute(string|null $toAccountId) {
        if ($this->type === "Transfer") {
            if ($this->from_account_id === null && $toAccountId === null) {
                throw new \Exception("Transfer transactions must have a from_account_id or a to_account_id");
            }
        } else {
            if ($toAccountId !== null) {
                throw new \Exception("Non-transfer transactions must not have a to_account_id");
            }
        }
        $this->attributes['to_account_id'] = $toAccountId;
    }
}
