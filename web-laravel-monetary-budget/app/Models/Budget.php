<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'name',
        'amount',
        'period_type',
    ];

    protected $casts = [
        'amount' => 'double',
    ];

    protected $appends = [
        'account_ids',
        'category_ids'
    ];

    public function getAccountIdsAttribute()
    {
        return BudgetAccounts::query()->where("budget_id", $this->id)->pluck('account_id')->toArray();
    }

    public function setAccountIdsAttribute(array $accountIds)
    {
        BudgetAccounts::query()->whereIn("account_id", $accountIds)->delete();
        foreach ($accountIds as $accountId) {
            BudgetAccounts::query()->create([
                'budget_id' => $this->id,
                'account_id' => $accountId
            ]);
        }
    }

    public function getCategoryIdsAttribute()
    {
        return BudgetCategories::query()->where("budget_id", $this->id)->pluck('category_id')->toArray();
    }

    public function setCategoryIdsAttribute(array $categoryIds)
    {
        BudgetCategories::query()->whereIn("category_id", $categoryIds)->delete();
        foreach ($categoryIds as $categoryId) {
            BudgetCategories::query()->create([
                'budget_id' => $this->id,
                'category_id' => $categoryId
            ]);
        }
    }
}