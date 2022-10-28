<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth.jwt')->only(['logout', 'current', 'update', 'destroy']);
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
        $user = User::create(request()->all());

		return [
			"message" => "Registered successfully!",
			"token" => auth()->login($user),
			"user" => $user
		];
    }

	/**
	 * Middleware:
	 * - auth.jwt
	 */
    public function logout()
    {
        auth()->logout();

        return [
            "message" => "Logged out successfully!"
        ];
    }

	/**
	 * Middleware:
	 * - auth.jwt
	 */
	public function current()
	{
		return auth()->user();
	}

	/**
	 * Middleware:
	 * - auth.jwt
	 */
    public function update()
    {
        auth()->user()->update(request()->all());
    }

	/**
	 * Middleware:
	 * - auth.jwt
	 */
    public function destroy()
    {
		auth()->user()->delete();
		auth()->logout();

		return [
			"message" => "User deleted successfully!"
		];
    }
}
