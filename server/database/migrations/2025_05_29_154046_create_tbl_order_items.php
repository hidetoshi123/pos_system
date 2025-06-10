<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_order_items', function (Blueprint $table) {
            $table->id(); // Default 'id' primary key for order_items table
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('item_id');
            $table->integer('quantity')->default(1);
            $table->decimal('discounted_price', 8, 2);
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('order_id')->references('order_id')->on('tbl_orders')->onDelete('cascade');
            // References 'item_id' on 'tbl_items' as confirmed by your tbl_items migration
            $table->foreign('item_id')->references('item_id')->on('tbl_items')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_order_items');
    }
};