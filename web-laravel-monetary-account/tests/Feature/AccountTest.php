<?php

namespace Tests\Feature;

use App\Models\Account;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AccountTest extends TestCase
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

    public function getAccountId($owned = true)
    {
        if ($owned) {
            return Account::query()->inRandomOrder()->first()->id;
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

    public function test_index_fails_without_auth()
    {
        $response = $this->get('/api/accounts');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_index_succeeds()
    {
        $response = $this->get('/api/accounts', $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'initial_balance',
                'color',
                'created_at',
                'updated_at',
            ]
        ]);
    }

    public function test_store_fails_without_auth()
    {
        $response = $this->post('/api/accounts');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $response = $this->post('/api/accounts', [
            'name' => [],
            'initial_balance' => 'invalid',
            'color' => 3,
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'name',
                'initial_balance',
                'color',
            ]
        ]);
    }

    public function test_store_succeeds()
    {
        $response = $this->post('/api/accounts', [
            'name' => 'Test Account',
            'initial_balance' => 1000,
            'color' => 'red',
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'id',
        ]);
    }

    public function test_show_fails_without_auth()
    {
        $response = $this->get('/api/accounts/' . $this->getAccountId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_fails_with_invalid_id()
    {
        $response = $this->get('/api/accounts/invalid', $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_fails_with_unowned_id()
    {
        $response = $this->get('/api/accounts/' . $this->getAccountId(false), $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_succeeds()
    {
        $response = $this->get('/api/accounts/' . $this->getAccountId(), $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'initial_balance',
            'color',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_update_fails_without_auth()
    {
        $response = $this->put('/api/accounts/' . $this->getAccountId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_invalid_id()
    {
        $response = $this->put('/api/accounts/invalid', $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_invalid_data()
    {
        $response = $this->put('/api/accounts/' . $this->getAccountId(), [
            'name' => [],
            'initial_balance' => 'invalid',
            'color' => 3,
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'name',
                'initial_balance',
                'color',
            ]
        ]);
    }

    public function test_update_fails_with_unowned_id()
    {
        $response = $this->put('/api/accounts/' . $this->getAccountId(false), [
            'name' => 'Test Account',
            'initial_balance' => 1000,
            'color' => 'red',
        ], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_succeeds()
    {
        $response = $this->put('/api/accounts/' . $this->getAccountId(), [
            'name' => 'Test Account',
            'initial_balance' => 1000,
            'color' => 'red',
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
        ]);
    }

    public function test_delete_fails_without_auth()
    {
        $response = $this->delete('/api/accounts/' . $this->getAccountId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_invalid_id()
    {
        $response = $this->delete('/api/accounts/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_unowned_id()
    {
        $response = $this->delete('/api/accounts/' . $this->getAccountId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_containted_transactions()
    {
        $accountId = DB::table("transactions")->first()->from_account_id;
        $response = $this->delete('/api/accounts/' . $accountId, [], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonPath('type', 'Transactions associated with this account exist');
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_containted_recurrences()
    {
        $accountId = DB::table("recurrences")->first()->from_account_id;
        DB::table("transactions")->where("from_account_id", $accountId)->orWhere("to_account_id", $accountId)->delete();
        $response = $this->delete('/api/accounts/' . $accountId, [], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonPath('type', 'Recurrences associated with this account exist');
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_succeeds()
    {
        $accountId = $this->getAccountId();
        DB::table("recurrences")->where("from_account_id", $accountId)->orWhere("to_account_id", $accountId)->delete();
        DB::table("transactions")->where("from_account_id", $accountId)->orWhere("to_account_id", $accountId)->delete();
        $response = $this->delete('/api/accounts/' . $accountId, [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
        ]);
    }
}
