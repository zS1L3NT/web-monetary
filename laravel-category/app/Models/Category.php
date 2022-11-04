<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'parent_category_id',
        'name',
        'color',
    ];

    public function getCategoriesAttribute()
    {
        $this::query()
            ->where("parent_category_id", $this->id)
            ->get();
    }
}
