<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth.jwt')->only(['logout', 'current', 'update', 'updatePassword', 'destroy']);

        $this->validate(
            'login',
            [
                'email' => 'required|email',
                'password' => [
                    'required',
                    'string'
                ]
            ]
        );

        $this->validate(
            'register',
            [
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
            ]
        );

        $this->validate(
            'update',
            [
                'email' => 'email',
                'password' => [
                    'string',
                    Password::min(8)
                        ->mixedCase()
                        ->numbers()
                        ->symbols()
                        ->uncompromised(),
                ]
            ]
        );

        $this->validate(
            'updatePassword',
            [
                'old_password' => [
                    'required',
                    'string',
                    Password::min(8)
                        ->mixedCase()
                        ->numbers()
                        ->symbols(),
                ],
                'new_password' => [
                    'required',
                    'string',
                    Password::min(8)
                        ->mixedCase()
                        ->numbers()
                        ->symbols()
                        ->uncompromised(),
                ]
            ]
        );
    }

    public function login()
    {
        if ($token = auth()->attempt(request(["email", "password"]))) {
            return [
                "message" => "Logged in successfully!",
                "token" => $token,
            ];
        } else {
            return response(
                [
                    "type" => "Login Error",
                    "message" => "Invalid login credentials!"
                ],
                400
            );
        }
    }

    public function register()
    {
        $user = User::query()->create(request()->all());

        return [
            "message" => "Registered successfully!",
            "token" => auth()->login($user),
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

        return [
            "message" => "User updated successfully!"
        ];
    }

    public function updatePassword()
    {
        if (password_verify(request("old_password"), auth()->user()->password)) {
            auth()->user()->update(["password" => request("new_password")]);
            return [
                "message" => "Password updated successfully!"
            ];
        } else {
            return response(
                [
                    "type" => "Password Update Error",
                    "message" => "Invalid login credentials!"
                ],
                400
            );
        }
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
