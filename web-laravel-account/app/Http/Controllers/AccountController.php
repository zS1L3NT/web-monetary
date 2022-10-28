<?php

namespace App\Http\Controllers;

use App\Models\Account;

class AccountController extends Controller
{
    public function index()
    {
        return Account::query()->where('user_id', request()->user_id)->get();
    }

    public function store()
    {
    }

    public function show(Account $account)
    {
    }

    public function update(Account $account)
    {
    }

    public function destroy(Account $account)
    {
    }
}
