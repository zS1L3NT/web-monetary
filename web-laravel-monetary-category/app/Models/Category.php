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
        'name',
        'color',
        'category_ids'
    ];

    protected $appends = [
        'category_ids'
    ];

    protected $hidden = [
        'user_id',
    ];

    public function getCategoryIdsAttribute()
    {
        return NestedCategory::query()->where('parent_category_id', $this->id)->pluck('child_category_id')->toArray();
    }

    public function setCategoryIdsAttribute(array $categoryIds)
    {
        NestedCategory::query()->where('parent_category_id', $this->id)->delete();
        foreach ($categoryIds as $categoryId) { 
            NestedCategory::query()->create([
                'parent_category_id' => $this->id,
                'child_category_id' => $categoryId,
            ]);
        }
    }
}