<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CategoryTest extends TestCase
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

    public function getCategoryId($owned = true)
    {
        if ($owned) {
            return Category::query()->inRandomOrder()->first()->id;
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
        $response = $this->get('/api/categories');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_index_succeeds()
    {
        $response = $this->get('/api/categories', $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'color',
                'category_ids',
                'created_at',
                'updated_at',
            ]
        ]);
    }

    public function test_store_fails_without_auth()
    {
        $response = $this->post('/api/categories');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $response = $this->post('/api/categories', [
            'name' => [],
            'color' => 3,
            'category_ids' => 3,
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'name',
                'color',
                'category_ids',
            ]
        ]);
    }

    public function test_store_fails_with_unowned_data()
    {
        $response = $this->post('/api/categories', [
            'name' => 'Test Category',
            'color' => 'red',
            'category_ids' => [$this->getCategoryId(false)]
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'category_ids.0',
            ]
        ]);
    }

    public function test_store_succeeds()
    {
        $response = $this->post('/api/categories', [
            'name' => 'Test Category',
            'color' => 'red',
            'category_ids' => [$this->getCategoryId()]
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'id',
        ]);
    }

    public function test_show_fails_without_auth()
    {
        $response = $this->get('/api/categories/' . $this->getCategoryId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_fails_with_invalid_id()
    {
        $response = $this->get('/api/categories/invalid', $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_fails_with_unowned_id()
    {
        $response = $this->get('/api/categories/' . $this->getCategoryId(false), $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_show_succeeds()
    {
        $response = $this->get('/api/categories/' . $this->getCategoryId(), $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'color',
            'category_ids',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_update_fails_without_auth()
    {
        $response = $this->put('/api/categories/' . $this->getCategoryId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_invalid_id()
    {
        $response = $this->put('/api/categories/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_invalid_data()
    {
        $response = $this->put('/api/categories/' . $this->getCategoryId(), [
            'name' => [],
            'color' => 3,
            'category_ids' => 3,
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'name',
                'color',
                'category_ids',
            ]
        ]);
    }

    public function test_update_fails_with_unowned_id()
    {
        $response = $this->put('/api/categories/' . $this->getCategoryId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_fails_with_unowned_data()
    {
        $response = $this->put('/api/categories/' . $this->getCategoryId(), [
            'name' => 'Test Category',
            'color' => 'red',
            'category_ids' => [$this->getCategoryId(false)]
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'category_ids.0',
            ]
        ]);
    }

    public function test_update_succeeds()
    {
        $response = $this->put('/api/categories/' . $this->getCategoryId(), [
            'name' => 'Test Category',
            'color' => 'red',
            'category_ids' => [$this->getCategoryId()]
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
        ]);
    }

    public function test_delete_fails_without_auth()
    {
        $response = $this->delete('/api/categories/' . $this->getCategoryId());

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_invalid_id()
    {
        $response = $this->delete('/api/categories/invalid', [], $this->getAuthHeaders());

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_unowned_id()
    {
        $response = $this->delete('/api/categories/' . $this->getCategoryId(false), [], $this->getAuthHeaders());

        $response->assertStatus(403);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_constrainted_transactions()
    {
        $categoryId = DB::table("transactions")->first()->category_id;
        $response = $this->delete('/api/categories/' . $categoryId, [], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonPath('type', 'Transactions associated with this category exist');
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_fails_with_constrainted_recurrences()
    {
        $categoryId = DB::table("recurrences")->first()->category_id;
        DB::table("transactions")->where("category_id", $categoryId)->delete();
        $response = $this->delete('/api/categories/' . $categoryId, [], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonPath('type', 'Recurrences associated with this category exist');
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_delete_succeeds()
    {
        $categoryId = $this->getCategoryId();
        DB::table("recurrences")->where("category_id", $categoryId)->delete();
        DB::table("transactions")->where("category_id", $categoryId)->delete();
        $response = $this->delete('/api/categories/' . $categoryId, [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
        ]);
    }
}