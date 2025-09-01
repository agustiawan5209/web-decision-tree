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
        Schema::create('dataset_sayurans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_sayuran');
            $table->text('manfaat')->nullable();
            $table->text('nutrisi')->nullable();
            $table->string('status')->comment('baik, buruk');
            $table->string('gejala')->comment('dapat memasukkan gejala lebih dari satu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dataset_sayurans');
    }
};
