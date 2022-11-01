<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class OwnsDebt
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
        if (request('debt')->user_id !== request('user_id')) {
            return response([
                "type" => "Unauthorized",
                "message" => "You do not own this debt."
            ], 403);
        }

        return $next($request);
    }
}
