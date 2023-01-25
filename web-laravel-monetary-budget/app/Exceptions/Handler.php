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
                "type" => "Budget not found",
                "message" => "There was no budget with the requested id: " . $throwable->getIds()[0],
            ], 404);
        }

        if ($throwable instanceof \PDOException && $throwable->getCode() === "22P02" && $throwable->errorInfo[1] === 7) {
            return response([
                "type" => "Budget not found",
                "message" => "There was no budget with the requested id: " . substr($request->getPathInfo(), strlen("/api/budgets/")),
            ], 404);
        }

        return response([
            "type" => "Unhandled Exception",
            "message" => $throwable->getMessage(),
            "stack" => $throwable->getTrace(),
        ], 500);
    }
}