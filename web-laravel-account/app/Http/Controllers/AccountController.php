<?php

namespace App\Http\Controllers;

use App\Models\Account;

class AccountController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.account')->only('index', 'show', 'update', 'destroy');

        $this->validate('store', [
            'name' => 'required',
            'balance' => 'required|numeric',
            'color' => 'required',
        ]);
    }

    public function index()
    {
        return Account::query()->where('user_id', request()->user_id)->get();
    }

    public function store()
    {
        $account = Account::new ([
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
    }

    public function destroy(Account $account)
    {
    }
}
