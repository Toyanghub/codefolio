<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = App\Models\User::where('email', 'selwyntayong12@gmail.com')->first();

if (!$user) {
    echo "User not found\n";
    exit;
}

echo "User: {$user->name}\n";
echo "Email: {$user->email}\n";
echo "Email Verified: " . ($user->email_verified ? '✅ TRUE' : '❌ FALSE') . "\n";
echo "Email Verified At: " . ($user->email_verified_at ?: 'null') . "\n";
