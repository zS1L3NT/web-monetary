<?php

namespace Tests\Feature;

use App\Models\Recurrence;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RecurrenceTest extends TestCase
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

    public function getRecurrenceId($owned = true)
    {
        if ($owned) {
            return Recurrence::query()->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $categoryId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $accountId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $recurrenceId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("categories")->insert(['id' => $categoryId, 'user_id' => $userId, 'name' => '-', 'color' => 'red']);
            DB::table("accounts")->insert(['id' => $accountId, 'user_id' => $userId, 'name' => '-', 'initial_balance' => 0, 'color' => 'red']);
            DB::table("recurrences")->insert([
                'id' => $recurrenceId,
                'user_id' => $userId,
                'category_id' => $categoryId,
                'from_account_id' => $accountId,
                'to_account_id' => null,
                'type' => 'Outgoing',
                'name' => '-',
                'amount' => 0,
                'description' => '-',
                'automatic' => false,
                'period_start_date' => Carbon::now(),
                'period_type' => 'Month',
                'period_interval' => 1,
                'period_end_type' => 'Never',
                'period_end_date' => null,
                'period_end_count' => null,
            ]);
            return $recurrenceId;
        }
    }

    public function getTransactionId($owned = true)
    {
        if ($owned) {
            return DB::table("transactions")->first()->id;
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
        $response = $this->get('/api/recurrences');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_index_succeeds()
    {
        $response = $this->get('/api/recurrences', $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'category_id',
                'from_account_id',
                'to_account_id',
                'type',
                'name',
                'amount',
                'description',
                'automatic',
                'period_start_date',
                'period_type',
                'period_interval',
                'period_end_type',
                'period_end_date',
                'period_end_count',
                'transaction_ids',
                'created_at',
                'updated_at'
            ]
        ]);
    }

    public function test_store_fails_without_auth()
    {
        $response = $this->post('/api/recurrences');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $response = $this->post('/api/recurrences', [
            'category_id' => 'invalid',
            'from_account_id' => 'invalid',
            'to_account_id' => 'invalid',
            'type' => 'invalid',
            'name' => 3,
            'amount' => 'invalid',
            'description' => 3,
            'automatic' => 'invalid',
            'period_start_date' => 'invalid',
            'period_type' => 'invalid',
            'period_interval' => 'invalid',
            'period_end_type' => 'invalid',
            'period_end_date' => 'invalid',
            'period_end_count' => 'invalid',
            'transaction_ids' => 'invalid'
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
                'name',
                'amount',
                'description',
                'automatic',
                'period_start_date',
                'period_type',
                'period_interval',
                'period_end_type',
                'period_end_date',
                'period_end_count',
                'transaction_ids',
            ]
        ]);
    }

    public function test_store_fails_with_unowned_data()
    {
        $response = $this->post('/api/recurrences', [
            'category_id' => $this->getCategoryId(false),
            'from_account_id' => $this->getAccountId(false),
            'to_account_id' => $this->getAccountId(false),
            'type' => 'Lend',
            'name' => 'Test',
            'amount' => 100,
            'description' => 'Test',
            'automatic' => true,
            'period_start_date' => '2021-01-01',
            'period_type' => 'Monthly',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => '2021-01-01',
            'period_end_count' => 1,
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_store_succeeds()
    {
        $response = $this->post('/api/recurrences', [
            'category_id' => $this->getCategoryId(),
            'from_account_id' => $this->getAccountId(),
            'to_account_id' => null,
            'type' => 'Outgoing',
            'name' => 'Test',
            'amount' => 100,
            'description' => 'Test',
            'automatic' => true,
            'period_start_date' => '2021-01-01',
            'period_type' => 'Month',
            'period_interval' => 1,
            'period_end_type' => 'Never',
            'period_end_date' => null,
            'period_end_count' => null,
            'transaction_ids' => [],
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'id',
        ]);
    }

    public function test_show_fails_without_auth()
    {
        $response = $this->get('/api/recurrences/' . $this->getRecurrenceId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_fails_with_invalid_id()
    {
        $response = $this->get('/api/recurrences/invalid', $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_fails_with_unowned_id()
    {
        $response = $this->get('/api/recurrences/' . $this->getRecurrenceId(false), $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_succeeds()
    {
        $response = $this->get('/api/recurrences/' . $this->getRecurrenceId(), $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'category_id',
            'from_account_id',
            'to_account_id',
            'type',
            'name',
            'amount',
            'description',
            'automatic',
            'period_start_date',
            'period_type',
            'period_interval',
            'period_end_type',
            'period_end_date',
            'period_end_count',
            'transaction_ids',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_update_fails_without_auth()
    {
        $response = $this->put('/api/recurrences/' . $this->getRecurrenceId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_invalid_id()
    {
        $response = $this->put('/api/recurrences/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_invalid_data()
    {
        $response = $this->put('/api/recurrences/' . $this->getRecurrenceId(), [
            'category_id' => 'invalid',
            'from_account_id' => 'invalid',
            'to_account_id' => 'invalid',
            'type' => 'invalid',
            'name' => 3,
            'amount' => 'invalid',
            'description' => 3,
            'automatic' => 'invalid',
            'transaction_ids' => 'invalid'
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
                'name',
                'amount',
                'description',
                'automatic',
                'transaction_ids'
            ]
        ]);
    }

    public function test_update_fails_with_unowned_id()
    {
        $response = $this->put('/api/recurrences/' . $this->getRecurrenceId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_unowned_data()
    {
        $response = $this->put('/api/recurrences/' . $this->getRecurrenceId(), [
            'category_id' => $this->getCategoryId(false),
            'from_account_id' => $this->getAccountId(false),
            'to_account_id' => $this->getAccountId(false),
            'type' => 'Outgoing',
            'name' => '-',
            'amount' => 100,
            'description' => '-',
            'automatic' => true,
            'transaction_ids' => [$this->getTransactionId(false)]
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_succeeds()
    {
        $response = $this->put('/api/recurrences/' . $this->getRecurrenceId(), [
            'category_id' => $this->getCategoryId(),
            'from_account_id' => $this->getAccountId(),
            'to_account_id' => null,
            'type' => 'Outgoing',
            'name' => '-',
            'amount' => 100,
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
        $response = $this->delete('/api/recurrences/' . $this->getRecurrenceId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_fails_with_invalid_id()
    {
        $response = $this->delete('/api/recurrences/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_fails_with_unowned_id()
    {
        $response = $this->delete('/api/recurrences/' . $this->getRecurrenceId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_succeeds()
    {
        $response = $this->delete('/api/recurrences/' . $this->getRecurrenceId(), [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }
}