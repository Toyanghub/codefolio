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
        Schema::create('reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('reactable_type');
            $table->unsignedBigInteger('reactable_id');
            $table->string('emoji', 10);
            $table->timestamps();
            $table->unique(
                ['user_id', 'reactable_type', 'reactable_id', 'emoji'],
                'unique_user_reaction',
            );
            $table->index(['reactable_type', 'reactable_id']);
            $table->index(['reactable_type', 'reactable_id', 'emoji']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reactions');
    }
};