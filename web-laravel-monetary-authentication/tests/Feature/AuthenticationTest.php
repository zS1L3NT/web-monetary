<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Console\Output\ConsoleOutput;
use Tests\TestCase;

class AuthenticationTest extends TestCase
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

    public function test_login_fails_with_invalid_credentials()
    {
        $response = $this->post('/api/login', [
            'email' => 'zechariahtan144@gmail.com',
            'password' => 'password'
        ]);

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_login_succeeds_with_valid_credentials()
    {
        $response = $this->post('/api/login', [
            'email' => 'zechariahtan144@gmail.com',
            'password' => 's3cuReP@ssw0rd'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'token'
        ]);
    }

    public function test_register_fails_with_invalid_data()
    {
        $response = $this->post('/api/register', [
            'email' => 'test',
            'password' => 'asd'
        ]);

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'email',
                'password'
            ]
        ]);
    }

    public function test_register_succeeds_with_valid_data()
    {
        $response = $this->post('/api/register', [
            'email' => 'test@gmail.com',
            'password' => 's3cuReP@ssw0rd',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'token'
        ]);
    }

    public function test_logout_fails_without_auth()
    {
        $response = $this->post('/api/logout');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_logout_succeeds()
    {
        $response = $this->post('/api/logout', [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }

    public function test_current_fails_without_auth()
    {
        $response = $this->get('/api/user');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_current_succeeds()
    {
        $response = $this->get('/api/user', $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'email',
            'created_at',
            'updated_at'
        ]);
    }

    public function test_update_fails_without_auth()
    {
        $response = $this->put('/api/user');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_succeeds()
    {
        $response = $this->put('/api/user', [
            'email' => 'zechariahtan144@gmail.com'
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }

    public function test_update_password_fails_without_auth()
    {
        $response = $this->put('/api/user/password');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_update_password_fails_with_wrong_old_password()
    {
        $response = $this->put('/api/user/password', [
            'old_password' => 's3cuReP@ssw0rd$$$',
            'new_password' => 's3cuReP@ssw0rd'
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
        ]);
    }

    public function test_update_password_fails_with_invalid_data()
    {
        $response = $this->put('/api/user/password', [
            'old_password' => 'test',
            'new_password' => 'test'
        ], $this->getAuthHeaders());

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'type',
            'message',
            'fields' => [
                'old_password',
                'new_password'
            ]
        ]);
    }

    public function test_update_password_succeeds()
    {
        $response = $this->put('/api/user/password', [
            'old_password' => 's3cuReP@ssw0rd',
            'new_password' => 's3cuReP@ssw0rd'
        ], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }

    public function test_delete_fails_without_auth()
    {
        $response = $this->delete('/api/user');

        $response->assertStatus(401);
        $response->assertJsonStructure([
            'type',
            'message'
        ]);
    }

    public function test_delete_succeeds()
    {
        $response = $this->delete('/api/user', [], $this->getAuthHeaders());

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message'
        ]);
    }
}
