<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\Console\Output\ConsoleOutput;

class OwnsAccount
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
        if (request()->route('account')->user_id !== request()->user_id) {
            return response([
                'type' => 'Unauthorized',
                'message' => 'You do not own this account.',
            ], 403);
        }

        return $next($request);
    }
}
