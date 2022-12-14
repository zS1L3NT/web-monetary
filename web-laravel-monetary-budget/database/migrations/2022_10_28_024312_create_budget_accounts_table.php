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
        Schema::create('budget_accounts', function (Blueprint $table) {
            $table->foreignUuid('budget_id')->references('id')->on('budgets')->cascadeOnDelete();
            $table->foreignUuid('account_id')->references('id')->on('accounts')->cascadeOnDelete();
            $table->primary(['budget_id', 'account_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('budget_accounts');
    }
};
