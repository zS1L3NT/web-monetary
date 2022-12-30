<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NestedCategory extends Model
{
    public $timestamps = false;

    public $primaryKey = null;

    public $incrementing = false;

    protected $fillable = [
        'parent_category_id',
        'child_category_id'
    ];
}
