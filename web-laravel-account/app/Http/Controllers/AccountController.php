<?php

namespace App\Http\Controllers;

use App\Models\Account;

class AccountController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.account')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'name' => 'required|string',
            'balance' => 'required|numeric',
            'color' => 'required|string',
        ]);

        $this->validate('update', [
            'name' => 'string',
            'balance' => 'numeric',
            'color' => 'string',
        ]);
    }

    public function index()
    {
        return Account::query()->where('user_id', request()->user_id)->get();
    }

    public function store()
    {
        $account = Account::create([
            'user_id' => request()->user_id,
            ...request()->all(),
        ]);

        return [
            "message" => "Account created successfully!",
            "account" => $account,
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
            "account" => $account,
        ];
    }

    public function destroy(Account $account)
    {
        $account->delete();

        return [
            "message" => "Account deleted successfully!",
        ];
    }
}
