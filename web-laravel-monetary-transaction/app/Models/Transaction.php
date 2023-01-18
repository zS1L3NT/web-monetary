<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Console\Output\ConsoleOutput;

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
        'amount' => 'double',
        'date' => 'date',
    ];

    protected $hidden = [
        'user_id',
    ];

    public function setTypeAttribute(string $type)
    {
        if (array_key_exists('to_account_id', $this->attributes)) {
            if ($type === "Transfer" && $this->to_account_id === null) {
                throw new \Exception("Transfer must have a to_account_id");
            }
            if ($type !== "Transfer" && $this->to_account_id !== null) {
                throw new \Exception("Non-transfer must not have a to_account_id");
            }
        }
        $this->attributes['type'] = $type;
    }

    public function setToAccountIdAttribute(string|null $toAccountId)
    {
        if (array_key_exists('type', $this->attributes)) {
            if ($this->type === "Transfer" && $toAccountId === null) {
                throw new \Exception("Transfer must have a to_account_id");
            }
            if ($this->type !== "Transfer" && $toAccountId !== null) {
                throw new \Exception("Non-transfer must not have a to_account_id");
            }
        }
        $this->attributes['to_account_id'] = $toAccountId;
    }
}
