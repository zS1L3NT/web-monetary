<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ValidJwt
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $request['user_id'] = JWTAuth::getPayload(JWTAuth::getToken())['sub'];
            return $next($request);
        } catch (\Exception $e) {
            if (request()->header("Authorization")) {
                return response([
                    "type" => "Unauthorized",
                    "message" => "Invalid authorization token"
                ], 401);
            } else {
                return response([
                    "type" => "Unauthorized",
                    "message" => "This route requires authentication"
                ], 401);
            }
        }
    }
}
