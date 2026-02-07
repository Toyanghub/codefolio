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
        Schema::table('users', function (Blueprint $table) {
            // Check if columns exist before adding to prevent duplicate column errors
            if (!Schema::hasColumn('users', 'email_verified')) {
                $table->boolean('email_verified')->default(false)->after('email');
            }
            if (!Schema::hasColumn('users', 'email_otp')) {
                $table->string('email_otp', 6)->nullable()->after('email_verified');
            }
            if (!Schema::hasColumn('users', 'email_otp_expires_at')) {
                $table->timestamp('email_otp_expires_at')->nullable()->after('email_otp');
            }
            if (!Schema::hasColumn('users', 'email_otp_attempts')) {
                $table->integer('email_otp_attempts')->default(0)->after('email_otp_expires_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'email_verified')) {
                $table->dropColumn('email_verified');
            }
            if (Schema::hasColumn('users', 'email_otp')) {
                $table->dropColumn('email_otp');
            }
            if (Schema::hasColumn('users', 'email_otp_expires_at')) {
                $table->dropColumn('email_otp_expires_at');
            }
            if (Schema::hasColumn('users', 'email_otp_attempts')) {
                $table->dropColumn('email_otp_attempts');
            }
        });
    }
};
