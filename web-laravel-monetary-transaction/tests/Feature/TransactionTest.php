<?php

namespace Tests\Feature;

use App\Models\Transaction;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use DatabaseTransactions;

    public function getAuthHeaders()
    {
        $response = Http::post('http://localhost:8000/api/login', [
            'email' => 'zechariahtan144@gmail.com',
            'password' => 's3cuReP@ssw0rd'
        ]);

        return [
            'Authorization' => 'Bearer ' . $response->json()['token']
        ];
    }

    public function getTransactionId($owned = true)
    {
        if ($owned) {
            return Transaction::query()->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $categoryId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $accountId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $transactionId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("categories")->insert(['id' => $categoryId, 'user_id' => $userId, 'name' => '-', 'color' => 'red']);
            DB::table("accounts")->insert(['id' => $accountId, 'user_id' => $userId, 'name' => '-', 'initial_balance' => 0, 'color' => 'red']);
            DB::table("transactions")->insert([
                'id' => $transactionId,
                'user_id' => $userId,
                'category_id' => $categoryId,
                'from_account_id' => $accountId,
                'to_account_id' => null,
                'type' => 'Outgoing',
                'amount' => 0,
                'date' => Carbon::now(),
                'description' => '-',
            ]);
            return $transactionId;
        }
    }

    public function getAccountId($owned = true)
    {
        if ($owned) {
            return DB::table("accounts")->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $accountId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("accounts")->insert([
                'id' => $accountId,
                'user_id' => $userId,
                'name' => '-',
                'initial_balance' => 0,
                'color' => 'red',
            ]);
            return $accountId;
        }
    }

    public function getCategoryId($owned = true)
    {
        if ($owned) {
            return DB::table("categories")->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $categoryId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("categories")->insert([
                'id' => $categoryId,
                'user_id' => $userId,
                'name' => '-',
                'color' => 'red'
            ]);
            return $categoryId;
        }
    }

    public function test_index_fails_without_auth()
    {
        $response = $this->get('/api/transactions');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_index_succeeds()
    {
        $response = $this->get('/api/transactions', $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'category_id',
                'from_account_id',
                'to_account_id',
                'type',
                'amount',
                'date',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);
    }

    public function test_store_fails_without_auth()
    {
        $response = $this->post('/api/transactions');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $response = $this->post('/api/transactions', [
            'category_id' => 'invalid',
            'from_account_id' => 'invalid',
            'to_account_id' => 'invalid',
            'type' => 'invalid',
            'amount' => 'invalid',
            'date' => 'invalid',
            'description' => 3,
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'category_id',
                'from_account_id',
                'to_account_id',
                'type',
                'amount',
                'date',
                'description',
            ]
        ]);
    }

    public function test_store_fails_with_unowned_data()
    {
        $response = $this->post('/api/transactions', [
            'category_id' => $this->getCategoryId(false),
            'from_account_id' => $this->getAccountId(false),
            'to_account_id' => $this->getAccountId(false),
            'type' => 'Lend',
            'amount' => 100,
            'date' => Carbon::now(),
            'description' => 'Test',
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_store_succeeds()
    {
        $response = $this->post('/api/transactions', [
            'category_id' => $this->getCategoryId(),
            'from_account_id' => $this->getAccountId(),
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 100,
            'date' => Carbon::now(),
            'description' => 'Test',
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'id',
        ]);
    }

    public function test_show_fails_without_auth()
    {
        $response = $this->get('/api/transactions/' . $this->getTransactionId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_fails_with_invalid_id()
    {
        $response = $this->get('/api/transactions/invalid', $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_fails_with_unowned_id()
    {
        $response = $this->get('/api/transactions/' . $this->getTransactionId(false), $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_succeeds()
    {
        $response = $this->get('/api/transactions/' . $this->getTransactionId(), $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'category_id',
            'from_account_id',
            'to_account_id',
            'type',
            'amount',
            'date',
            'description',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_update_fails_without_auth()
    {
        $response = $this->put('/api/transactions/' . $this->getTransactionId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_invalid_id()
    {
        $response = $this->put('/api/transactions/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_invalid_data()
    {
        $response = $this->put('/api/transactions/' . $this->getTransactionId(), [
            'category_id' => 'invalid',
            'from_account_id' => 'invalid',
            'to_account_id' => 'invalid',
            'type' => 'invalid',
            'amount' => 'invalid',
            'description' => 3,
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'category_id',
                'from_account_id',
                'to_account_id',
                'type',
                'amount',
                'description',
            ]
        ]);
    }

    public function test_update_fails_with_unowned_id()
    {
        $response = $this->put('/api/transactions/' . $this->getTransactionId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_unowned_data()
    {
        $response = $this->put('/api/transactions/' . $this->getTransactionId(), [
            'category_id' => $this->getCategoryId(false),
            'from_account_id' => $this->getAccountId(false),
            'to_account_id' => $this->getAccountId(false),
            'type' => 'Outgoing',
            'amount' => 100,
            'date' => Carbon::now(),
            'description' => '-',
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_succeeds()
    {
        $response = $this->put('/api/transactions/' . $this->getTransactionId(), [
            'category_id' => $this->getCategoryId(),
            'from_account_id' => $this->getAccountId(),
            'to_account_id' => null,
            'type' => 'Outgoing',
            'amount' => 100,
            'date' => Carbon::now(),
            'description' => '-',
            'automatic' => true,
            'transaction_ids' => [$this->getTransactionId()]
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }

    public function test_destroy_fails_without_auth()
    {
        $response = $this->delete('/api/transactions/' . $this->getTransactionId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_fails_with_invalid_id()
    {
        $response = $this->delete('/api/transactions/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_fails_with_unowned_id()
    {
        $response = $this->delete('/api/transactions/' . $this->getTransactionId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_succeeds()
    {
        $response = $this->delete('/api/transactions/' . $this->getTransactionId(), [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }
}
