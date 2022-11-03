<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth.jwt')->only(['logout', 'current', 'update', 'destroy']);

        $this->validate('login', [
            'email' => 'required|email',
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ]
        ]);

        $this->validate('register', [
            'username' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ]
        ]);

        $this->validate('update', [
            'username' => 'string',
            'email' => 'email',
            'password' => [
                'string',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ]
        ]);
    }

    public function login()
    {
        if ($token = auth()->attempt(request(["email", "password"]))) {
            return [
                "message" => "Logged in successfully!",
                "token" => $token,
                "user" => auth()->user()
            ];
        } else {
            return response([
                "type" => "Login Error",
                "message" => "Invalid login credentials!"
            ], 400);
        }
    }

    public function register()
    {
        $user = User::query()->create(request()->all());

        return [
            "message" => "Registered successfully!",
            "token" => auth()->login($user),
            "user" => $user
        ];
    }

    public function logout()
    {
        auth()->logout();

        return [
            "message" => "Logged out successfully!"
        ];
    }

    public function current()
    {
        return auth()->user();
    }

    public function update()
    {
        auth()->user()->update(request()->all());
    }

    public function destroy()
    {
        auth()->user()->delete();
        auth()->logout();

        return [
            "message" => "User deleted successfully!"
        ];
    }
}
