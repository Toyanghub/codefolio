<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Check user status
$user = App\Models\User::where('email', 'selwyntayong12@gmail.com')->first();

if (!$user) {
    echo "❌ User not found!\n";
    exit;
}

echo "✅ User found!\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "ID: {$user->id}\n";
echo "Name: {$user->name}\n";
echo "Email: {$user->email}\n";
echo "Google ID: " . ($user->google_id ?: 'Not set') . "\n";
echo "GitHub ID: " . ($user->github_id ?: 'Not set') . "\n";
echo "Email Verified: " . ($user->email_verified ? '✅ TRUE' : '❌ FALSE') . "\n";
echo "Email Verified At: " . ($user->email_verified_at ?: 'null') . "\n";
echo "Created At: {$user->created_at}\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

// Ask if they want to fix it
if (!$user->email_verified) {
    echo "\n⚠️  User is NOT verified!\n";
    echo "Do you want to mark this user as verified? (yes/no): ";
    $handle = fopen("php://stdin", "r");
    $line = fgets($handle);
    
    if (trim(strtolower($line)) === 'yes') {
        $user->email_verified = true;
        $user->email_verified_at = now();
        $user->save();
        echo "✅ User marked as verified!\n";
    } else {
        echo "❌ No changes made.\n";
    }
    fclose($handle);
} else {
    echo "\n✅ User is already verified!\n";
}
