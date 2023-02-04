<?php

namespace Tests\Feature;

use App\Models\Debt;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DebtTest extends TestCase
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

    public function getDebtId($owned = true)
    {
        if ($owned) {
            return Debt::query()->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $debtId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("debts")->insert([
                'id' => $debtId,
                'user_id' => $userId,
                'type' => 'Lend',
                'amount' => 0,
                'due_date' => Carbon::now(),
                'name' => '-',
                'description' => '-',
                'active' => true
            ]);
            return $debtId;
        }
    }

    public function getTransactionId($owned = true)
    {
        if ($owned) {
            return DB::table("transactions")->first()->id;
        } else {
            $userId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $transactionId = \Ramsey\Uuid\Uuid::uuid4()->toString();
            DB::table("users")->insert(['id' => $userId, 'email' => $userId, 'password' => '-']);
            DB::table("transactions")->insert([
                'id' => $transactionId,
                'user_id' => $userId,
                'category_id' => DB::table('categories')->first()->id,
                'from_account_id' => DB::table('accounts')->first()->id,
                'to_account_id' => null,
                'type' => 'Outgoing',
                'amount' => 0,
                'date' => Carbon::now(),
                'description' => '-',
            ]);
            return $transactionId;
        }
    }


    public function test_index_fails_without_auth()
    {
        $response = $this->get('/api/debts');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_index_succeeds()
    {
        $response = $this->get('/api/debts', $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'type',
                'amount',
                'due_date',
                'name',
                'description',
                'active',
                'transaction_ids',
                'created_at',
                'updated_at'
            ]
        ]);
    }

    public function test_store_fails_without_auth()
    {
        $response = $this->post('/api/debts');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $response = $this->post('/api/debts', [
            'type' => 'invalid',
            'amount' => 'invalid',
            'due_date' => 'invalid',
            'name' => 3,
            'description' => 3,
            'active' => 'invalid',
            'transaction_ids' => 'invalid'
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'type',
                'amount',
                'due_date',
                'name',
                'description',
                'active'
            ]
        ]);
    }

    public function test_store_fails_with_unowned_data()
    {
        $response = $this->post('/api/debts', [
            'type' => 'Lend',
            'amount' => 100,
            'due_date' => '2021-01-01',
            'name' => 'Test',
            'description' => 'Test',
            'active' => true,
            'transaction_ids' => [$this->getTransactionId(false)]
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_store_succeeds()
    {
        $response = $this->post('/api/debts', [
            'type' => 'Lend',
            'amount' => 100,
            'due_date' => '2021-01-01',
            'name' => 'Test',
            'description' => 'Test',
            'active' => true,
            'transaction_ids' => [$this->getTransactionId()]
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'id',
        ]);
    }

    public function test_show_fails_without_auth()
    {
        $response = $this->get('/api/debts/' . $this->getDebtId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_fails_with_invalid_id()
    {
        $response = $this->get('/api/debts/invalid', $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_fails_with_unowned_id()
    {
        $response = $this->get('/api/debts/' . $this->getDebtId(false), $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_show_succeeds()
    {
        $response = $this->get('/api/debts/' . $this->getDebtId(), $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'type',
            'amount',
            'due_date',
            'name',
            'description',
            'active',
            'transaction_ids',
            'created_at',
            'updated_at'
        ]);
    }

    public function test_update_fails_without_auth()
    {
        $response = $this->put('/api/debts/' . $this->getDebtId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_invalid_id()
    {
        $response = $this->put('/api/debts/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_invalid_data()
    {
        $response = $this->put('/api/debts/' . $this->getDebtId(), [
            'type' => 'invalid',
            'amount' => 'invalid',
            'due_date' => 'invalid',
            'name' => 3,
            'description' => 3,
            'active' => 'invalid',
            'transaction_ids' => 'invalid'
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'type',
                'amount',
                'due_date',
                'name',
                'description',
                'active',
                'transaction_ids'
            ]
        ]);
    }

    public function test_update_fails_with_unowned_id()
    {
        $response = $this->put('/api/debts/' . $this->getDebtId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_fails_with_unowned_data()
    {
        $response = $this->put('/api/debts/' . $this->getDebtId(), [
            'type' => 'Lend',
            'amount' => 100,
            'due_date' => '2021-01-01',
            'name' => 'Test',
            'description' => 'Test',
            'active' => true,
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
        $response = $this->put('/api/debts/' . $this->getDebtId(), [
            'type' => 'Lend',
            'amount' => 100,
            'due_date' => '2021-01-01',
            'name' => 'Test',
            'description' => 'Test',
            'active' => true
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }

    public function test_destroy_fails_without_auth()
    {
        $response = $this->delete('/api/debts/' . $this->getDebtId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_fails_with_invalid_id()
    {
        $response = $this->delete('/api/debts/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_fails_with_unowned_id()
    {
        $response = $this->delete('/api/debts/' . $this->getDebtId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_destroy_succeeds()
    {
        $response = $this->delete('/api/debts/' . $this->getDebtId(), [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }
}
