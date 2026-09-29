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
        Schema::table('lab_members', function (Blueprint $table) {
            $table->longText('body_en')->nullable()->after('bio_tr');
            $table->longText('body_tr')->nullable()->after('body_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lab_members', function (Blueprint $table) {
            $table->dropColumn(['body_en', 'body_tr']);
        });
    }
};
