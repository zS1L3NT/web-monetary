<?php

namespace App\Http\Controllers;

use App\Models\Transaction;

class TransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.transaction')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'category_id' => 'required|uuid|exists:categories,id',
            'from_account_id' => 'required_unless:type,Transfer|uuid|exists:accounts,id',
            'to_account_id' => 'required_if:from_account_id,null|prohibited_unless:type,Transfer|uuid|exists:accounts,id',
            'type' => 'required|in:Incoming,Outgoing,Transfer',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'string',
        ]);

        $this->validate('update', [
            'category_id' => 'uuid|exists:categories,id',
            'from_account_id' => 'uuid|exists:accounts,id',
            'to_account_id' => 'uuid|exists:accounts,id',
            'type' => 'in:Incoming,Outgoing,Transfer',
            'amount' => 'numeric',
            'date' => 'date',
            'description' => 'string',
        ]);
    }

    public function index()
    {
        $query = Transaction::query()
            ->where('user_id', request()->user_id)
            ->orderByDesc('date')
            ->limit(100);

        if ($from_account_id = request()->from_account_id) {
            $query->where('from_account_id', $from_account_id);
        }

        if ($to_account_id = request()->to_account_id) {
            $query->where('to_account_id', $to_account_id);
        }

        if ($category_ids = request()->category_ids) {
            $query->whereIn('category_id', $category_ids);
        }

        if ($limit = request()->query("limit")) {
            if (is_numeric($limit)) {
                $query->limit($limit);
            } else {
                return response([
                    "message" => "Invalid limit value!",
                ], 400);
            }
        }

        if ($offset = request()->query("offset")) {
            if (is_numeric($offset)) {
                $query->offset($offset);
            } else {
                return response([
                    "message" => "Invalid offset value!",
                ], 400);
            }
        }

        return $query->get();
    }

    public function store()
    {
        $transaction = Transaction::create([
            'user_id' => request()->user_id,
            ...request()->all(),
        ]);

        return [
            "message" => "Transaction created successfully!",
            "transaction" => $transaction,
        ];
    }

    public function show(Transaction $transaction)
    {
        return $transaction;
    }

    public function update(Transaction $transaction)
    {
        $transaction->update(request()->all());

        return [
            "message" => "Transaction updated successfully!",
            "transaction" => $transaction,
        ];
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return [
            "message" => "Transaction deleted successfully!",
        ];
    }
}
