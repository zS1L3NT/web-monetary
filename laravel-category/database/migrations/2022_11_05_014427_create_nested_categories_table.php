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
        Schema::create('nested_categories', function (Blueprint $table) {
            $table->foreignUuid('parent_category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignUuid('child_category_id')->constrained('categories')->cascadeOnDelete();
            $table->primary(['parent_category_id', 'child_category_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nested_categories');
    }
};
