<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Validation\Rule;

class TransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware('owns.transaction')->only(['show', 'update', 'destroy']);

        $this->validate('store', [
            'category_id' => [
                'required',
                'uuid',
                Rule::exists('categories', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'from_account_id' => [
                'required',
                'uuid',
                Rule::exists('accounts', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'to_account_id' => [
                'nullable',
                'uuid',
                Rule::exists('accounts', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'type' => 'required|in:Incoming,Outgoing,Transfer',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'string',
        ]);

        $this->validate('update', [
            'category_id' => [
                'uuid',
                Rule::exists('categories', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'from_account_id' => [
                'uuid',
                Rule::exists('accounts', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'to_account_id' => [
                'nullable',
                'uuid',
                Rule::exists('accounts', 'id')->where(fn($query) => $query->where('user_id', request('user_id'))),
            ],
            'type' => 'in:Incoming,Outgoing,Transfer',
            'amount' => 'numeric',
            'description' => 'string',
        ]);
    }

    public function index()
    {
        $query = Transaction::query()
            ->where('user_id', request('user_id'))
            ->orderByDesc('date');

        if ($transaction_ids = request('transaction_ids')) {
            $transaction_ids = explode(',', $transaction_ids);
            $query->whereIn('id', $transaction_ids);
        }

        if ($from_account_ids = request('from_account_ids')) {
            $from_account_ids = explode(',', $from_account_ids);
            if (in_array('null', $from_account_ids)) {
                if (count($from_account_ids) === 1) {
                    $query->whereNull('from_account_id');
                } else {
                    $query->whereIn('from_account_id', array_filter($from_account_ids, fn($a) => strtolower($a) !== "null"))->orWhereNull('from_account_id');
                }
            } else {
                $query->whereIn('from_account_id', $from_account_ids);
            }
        }

        if ($to_account_ids = request('to_account_ids')) {
            $to_account_ids = explode(',', $to_account_ids);
            if (in_array('null', $to_account_ids)) {
                if (count($to_account_ids) === 1) {
                    $query->whereNull('to_account_id');
                } else {
                    $query->whereIn('to_account_id', array_filter($to_account_ids, fn($a) => strtolower($a) !== "null"))->orWhereNull('to_account_id');
                }
            } else {
                $query->whereIn('to_account_id', $to_account_ids);
            }
        }

        if ($category_ids = request('category_ids')) {
            $query->whereIn('category_id', explode(",", $category_ids));
        }

        if ($type = request('type')) {
            $query->where('type', $type);
        }

        if ($limit = request("limit")) {
            if (is_numeric($limit)) {
                $query->limit($limit);
            } else {
                return response([
                    "message" => "Invalid limit value!",
                ], 400);
            }
        }

        if ($offset = request("offset")) {
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
        $transaction = Transaction::query()->create(request()->all());

        return [
            "message" => "Transaction created successfully!",
            "id" => $transaction->id,
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