<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('debt_transactions', function (Blueprint $table) {
            $table->foreignUuid('debt_id')->constrained('debts')->cascadeOnDelete();
            $table->foreignUuid('transaction_id')->constrained('transactions')->cascadeOnDelete();
            $table->primary(['debt_id', 'transaction_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('debt_transactions');
    }
};
