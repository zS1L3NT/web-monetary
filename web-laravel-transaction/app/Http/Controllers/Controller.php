<?php

namespace App\Http\Controllers;

use Closure;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function validate(string $route, array $rules) {
        $this
            ->middleware(function (Request $request, Closure $next) use ($rules) {
                $validator = Validator::make(request(), $rules);

                if ($validator->fails()) {
                    return response([
                        "message" => "Invalid data",
                        "errors" => $validator->errors()->messages()
                    ], 400);
                } else {
                    return $next($request);
                }
            })
            ->only($route);
    }
}
