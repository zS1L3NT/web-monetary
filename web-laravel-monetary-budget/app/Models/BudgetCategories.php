<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetCategories extends Model
{
    public $timestamps = false;

    public $primaryKey = null;

    public $incrementing = false;

    protected $fillable = [
        'budget_id',
        'category_id',
    ];
}
