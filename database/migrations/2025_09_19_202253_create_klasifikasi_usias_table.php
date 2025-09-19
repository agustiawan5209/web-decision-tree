<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('klasifikasi_usias', function (Blueprint $table) {
            $table->id();
            $table->integer('min_usia');
            $table->integer('max_usia');
            $table->text('sayuran')->nullable();
            $table->string('porsi')->nullable();
            $table->string('tekstur')->nullable();
            $table->string('frekuensi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('klasifikasi_usias');
    }
};
