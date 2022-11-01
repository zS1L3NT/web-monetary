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

    public function setTypeAttribute(string $type)
    {
        switch ($type) {
            case "Transfer":
                if ($this->from_account_id === null && $this->to_account_id === null) {
                    throw new \Exception("Transfer recurrances must have a from_account_id or a to_account_id");
                }
                break;
            case "Incoming":
            case "Outgoing":
                if ($this->from_account_id === null) {
                    throw new \Exception("Non-transfer recurrances must not have a null from_account_id");
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
                    throw new \Exception("Transfer recurrances must have a from_account_id or a to_account_id");
                }
                break;
            case "Incoming":
            case "Outgoing":
                if ($fromAccountId === null) {
                    throw new \Exception("Non-transfer recurrances must not have a null from_account_id");
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
                    throw new \Exception("Transfer recurrances must have a from_account_id or a to_account_id");
                }
                break;
            case "Incoming":
            case "Outgoing":
                if ($toAccountId !== null) {
                    throw new \Exception("Non-transfer recurrances must not have a to_account_id");
                }
                break;
        }
        $this->attributes['to_account_id'] = $toAccountId;
    }
}
