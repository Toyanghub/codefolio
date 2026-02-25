<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Verify specific user
$user = App\Models\User::where('email', 'selwyntayong12@gmail.com')->first();

if (!$user) {
    echo "❌ User not found!\n";
    exit;
}

echo "Verifying user: {$user->name} ({$user->email})\n";

$user->email_verified = true;
$user->email_verified_at = now();
$user->save();

echo "✅ User has been marked as verified!\n";
echo "They can now log in with Google without OTP verification.\n";
