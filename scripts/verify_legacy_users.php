<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  Verifying All Legacy OAuth Users\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

// Find all users with OAuth IDs who are not verified
$users = App\Models\User::where(function($query) {
    $query->whereNotNull('google_id')
          ->orWhereNotNull('github_id');
})
->where('email_verified', false)
->get();

if ($users->isEmpty()) {
    echo "✅ No unverified OAuth users found!\n";
    exit;
}

echo "Found {$users->count()} unverified OAuth user(s):\n\n";

foreach ($users as $user) {
    echo "  ├─ {$user->name} ({$user->email})\n";
    echo "  │  Google ID: " . ($user->google_id ?: 'none') . "\n";
    echo "  │  GitHub ID: " . ($user->github_id ?: 'none') . "\n";
    echo "  │  Created: {$user->created_at}\n";
    echo "  │\n";
}

echo "\nMarking all as verified...\n";

$count = 0;
foreach ($users as $user) {
    $user->email_verified = true;
    $user->email_verified_at = now();
    $user->save();
    $count++;
    echo "  ✅ {$user->name}\n";
}

echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "✅ Successfully verified {$count} user(s)!\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
