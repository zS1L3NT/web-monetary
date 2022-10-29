<?php

use App\Http\Controllers\RecurranceController;
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


Route::apiResource("recurrances", RecurranceController::class)->middleware('auth.jwt');

Route::fallback(fn () => response([
	"type" => "Page Not Found",
	"message" => "The route you requested could not be found"
], 404));
