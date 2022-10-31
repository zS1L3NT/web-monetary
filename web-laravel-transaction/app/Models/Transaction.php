<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'category_id',
        'from_account_id',
        'to_account_id',
        'type',
        'amount',
        'date',
        'description',
    ];

    protected $casts = [
        'amount' => 'integer',
        'date' => 'date',
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
