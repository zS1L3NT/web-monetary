<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $throwable)
    {
        if ($throwable instanceof ModelNotFoundException) {
            return response([
                "type" => "Category not found",
                "message" => "There is no category with the requested id: " . $throwable->getIds()[0],
            ], 404);
        }

        if ($throwable instanceof \PDOException) {
            switch ($throwable->getCode()) {
                case "22P02":
                    return response([
                        "type" => "Category not found",
                        "message" => "There is no category with the requested id: " . substr(request()->getPathInfo(), strlen("/api/categories/")),
                    ], 404);
                case "23505":
                    return response([
                        "type" => "Category with that name already exists",
                        "message" => "There is already a category with the requested name: " . request("name"),
                    ], 409);
            }
        }

        return response([
            "type" => "Unhandled Exception",
            "message" => $throwable->getMessage(),
            "stack" => $throwable->getTrace(),
        ], 500);
    }
}