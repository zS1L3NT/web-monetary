<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Database\QueryException;

class AccountController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.account')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'name' => 'required|string',
            'initial_balance' => 'required|numeric',
            'color' => 'required|string',
        ]);

        $this->validate('update', [
            'name' => 'string',
            'initial_balance' => 'numeric',
            'color' => 'string',
        ]);
    }

    public function index()
    {
        return Account::query()
            ->where('user_id', request('user_id'))
            ->orderBy('name')
            ->get();
    }

    public function store()
    {
        $account = Account::query()->create(request()->all());

        return [
            "message" => "Account created successfully!",
            "id" => $account->id,
        ];
    }

    public function show(Account $account)
    {
        return $account;
    }

    public function update(Account $account)
    {
        $account->update(request()->all());

        return [
            "message" => "Account updated successfully!",
        ];
    }

    public function destroy(Account $account)
    {
        try {
            $account->delete();
        } catch (QueryException $e) {
            if (str_contains($e->getMessage(), "Foreign key violation")) {
                if (str_contains($e->getMessage(), "recurrence")) {
                    return response([
                        "type" => "Recurrences associated with this account exist",
                        "message" => "You cannot delete an account that has recurrences associated with it.",
                    ], 400);
                }

                if (str_contains($e->getMessage(), "transaction")) {
                    return response([
                        "type" => "Transactions associated with this account exist",
                        "message" => "You cannot delete an account that has transactions associated with it.",
                    ], 400);
                }

                return response([
                    "type" => "Uncaught Foreign Key Constraint",
                    "message" => $e->getMessage(),
                ], 400);
            } else {
                throw $e;
            }
        }

        return [
            "message" => "Account deleted successfully!",
        ];
    }
}