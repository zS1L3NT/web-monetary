<?php

namespace Tests\Feature;

use App\Models\Budget;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    use DatabaseTransactions;

    public function getAuthHeaders()
    {
        $response = Http::post('http://localhost:8000/api/login', [
            'email' => 'zechariahtan144@gmail.com',
            'password' => 'P@ssw0rd'
        ]);

        return [
            'Authorization' => 'Bearer ' . $response->json()['token']
        ];
    }

    public function getBudgetId($owned = true)
    {
        if ($owned) {
            return Budget::query()->inRandomOrder()->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $budgetId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("budgets")->insert([
                'id' => $budgetId,
                'user_id' => $userId,
                'name' => '-',
                'amount' => 0,
                'period_type' => 'Day',
            ]);
            return $budgetId;
        }
    }

    public function getAccountId($owned = true)
    {
        if ($owned) {
            return DB::table('accounts')->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $accountId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("accounts")->insert([
                'id' => $accountId,
                'user_id' => $userId,
                'name' => '-',
                'initial_balance' => 0,
                'color' => '-'
            ]);
            return $accountId;
        }
    }

    public function getCategoryId($owned = true)
    {
        if ($owned) {
            return DB::table('categories')->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $categoryId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("categories")->insert([
                'id' => $categoryId,
                'user_id' => $userId,
                'name' => '-',
                'color' => '-'
            ]);
            return $categoryId;
        }
    }

    public function test_index_fails_without_auth()
    {
        $response = $this->get('/api/budgets');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_index_succeeds()
    {
        $response = $this->get('/api/budgets', $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'amount',
                'period_type',
                'account_ids',
                'category_ids',
                'created_at',
                'updated_at',
            ]
        ]);
    }

    public function test_store_fails_without_auth()
    {
        $response = $this->post('/api/budgets');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $response = $this->post('/api/budgets', [
            'name' => [],
            'amount' => [],
            'period_type' => 'Months',
            'account_ids' => '',
            'category_ids' => '',
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'name',
                'amount',
                'period_type',
                'account_ids',
                'category_ids',
            ]
        ]);
    }

    public function test_store_fails_with_unowned_data()
    {
        $response = $this->post('/api/budgets', [
            'name' => 'Test Budget',
            'amount' => 1000,
            'period_type' => 'Month',
            'account_ids' => [$this->getAccountId(false)],
            'category_ids' => [$this->getCategoryId(false)],
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'account_ids.0',
                'category_ids.0',
            ]
        ]);
    }

    public function test_store_succeeds()
    {
        $response = $this->post('/api/budgets', [
            'name' => 'Test Budget',
            'amount' => 1000,
            'period_type' => 'Month',
            'account_ids' => [$this->getAccountId()],
            'category_ids' => [$this->getCategoryId()],
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'id',
        ]);
    }

    public function test_show_fails_without_auth()
    {
        $response = $this->get('/api/budgets/' . $this->getBudgetId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_fails_with_invalid_id()
    {
        $response = $this->get('/api/budgets/invalid', $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_fails_with_unowned_id()
    {
        $response = $this->get('/api/budgets/' . $this->getBudgetId(false), $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_succeeds()
    {
        $response = $this->get('/api/budgets/' . $this->getBudgetId(), $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'amount',
            'period_type',
            'account_ids',
            'category_ids',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_update_fails_without_auth()
    {
        $response = $this->put('/api/budgets/' . $this->getBudgetId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_invalid_id()
    {
        $response = $this->put('/api/budgets/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_invalid_data()
    {
        $response = $this->put('/api/budgets/' . $this->getBudgetId(), [
            'name' => [],
            'amount' => 'invalid',
            'period_type' => 'invalid',
            'account_ids' => 3,
            'category_ids' => 3
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'name',
                'amount',
                'period_type',
                'account_ids',
                'category_ids',
            ]
        ]);
    }

    public function test_update_fails_with_unowned_id()
    {
        $response = $this->put('/api/budgets/' . $this->getBudgetId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_unowned_data()
    {
        $response = $this->put('/api/budgets/' . $this->getBudgetId(), [
            'name' => 'Test Budget',
            'amount' => 1000,
            'period_type' => 'Month',
            'account_ids' => [$this->getAccountId(false)],
            'category_ids' => [$this->getCategoryId(false)],
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'account_ids.0',
                'category_ids.0',
            ]
        ]);
    }

    public function test_update_succeeds()
    {
        $response = $this->put('/api/budgets/' . $this->getBudgetId(), [
            'name' => 'Test Budget',
            'amount' => 1000,
            'period_type' => 'Month',
            'account_ids' => [$this->getAccountId()],
            'category_ids' => [$this->getCategoryId()],
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
        ]);
    }

    public function test_delete_fails_without_auth()
    {
        $response = $this->delete('/api/budgets/' . $this->getBudgetId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_invalid_id()
    {
        $response = $this->delete('/api/budgets/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_unowned_id()
    {
        $response = $this->delete('/api/budgets/' . $this->getBudgetId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_succeeds()
    {
        $response = $this->delete('/api/budgets/' . $this->getBudgetId(), [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
        ]);
    }
}