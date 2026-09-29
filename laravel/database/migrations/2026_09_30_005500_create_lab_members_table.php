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
        Schema::create('lab_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role_en')->nullable();
            $table->string('role_tr')->nullable();
            $table->text('bio_en')->nullable();
            $table->text('bio_tr')->nullable();
            $table->string('phone')->nullable();
            $table->json('emails')->nullable();
            $table->string('avatar')->nullable();
            $table->string('cv_en')->nullable();
            $table->string('cv_tr')->nullable();
            $table->json('social_links')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_members');
    }
};
