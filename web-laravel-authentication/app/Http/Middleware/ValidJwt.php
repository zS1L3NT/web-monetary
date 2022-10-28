<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HasJwt
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
        if (auth()->user()) {
			return $next($request);
		} else if (request()->header("Authorization")) {
			return response([
				"type" => "Unauthorized",
				"message" => "Invalid authorization token"
			], 403);
		} else {
			return response([
				"type" => "Unauthorized",
				"message" => "This route requires authentication"
			], 403);
		}
    }
}
