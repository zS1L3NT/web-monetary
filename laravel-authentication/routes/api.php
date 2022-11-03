<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::controller(UserController::class)->group(function () {
	Route::post("login", "login");
	Route::post("register", "register");
	Route::post("logout", "logout");
	Route::get("user", "current");
	Route::put("user", "update");
	Route::delete("user", "destroy");
});

Route::fallback(fn () => response([
	"type" => "Page Not Found",
	"message" => "The route you requested could not be found"
], 404));
