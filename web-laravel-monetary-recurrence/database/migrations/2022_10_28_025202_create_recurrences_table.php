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
        Schema::create('recurrences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('category_id')->constrained('categories');
            $table->foreignUuid('from_account_id')->constrained('accounts');
            $table->foreignUuid('to_account_id')->nullable()->constrained('accounts');
            $table->enum('type', ['Incoming', 'Outgoing', 'Transfer']);
            $table->string('name');
            $table->decimal('amount', 8, 2);
            $table->string('description')->default('');
            $table->boolean('automatic');
            $table->timestamp('period_start_date');
            $table->enum('period_type', ['Day', 'Week', 'Month', 'Year']);
            $table->integer('period_interval');
            $table->enum('period_end_type', ['Never', 'Date', 'Count']);
            $table->timestamp('period_end_date')->nullable();
            $table->integer('period_end_count')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('recurrences');
    }
};
