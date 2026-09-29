<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->string('title_tr')->nullable()->after('title_en');
            $table->text('text_en')->nullable()->after('text');
            $table->text('text_tr')->nullable()->after('text_en');
        });

        // Copy existing title and text to English fields by default
        DB::table('sliders')->update([
            'title_en' => DB::raw('title'),
            'text_en' => DB::raw('text'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'title_tr', 'text_en', 'text_tr']);
        });
    }
};
