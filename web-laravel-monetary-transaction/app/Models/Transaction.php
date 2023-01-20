<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
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
        'amount',
        'date',
        'description',
    ];

    protected $casts = [
        'amount' => 'double',
        'date' => 'datetime',
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
}
