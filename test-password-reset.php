<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Password;
use App\Models\User;

try {
    // Find the first user
    $user = User::first();
    
    if (!$user) {
        echo "✗ No users found in database. Please create a user first.\n";
        exit(1);
    }
    
    echo "Testing password reset email for: {$user->email}\n\n";
    
    // Send password reset notification
    $status = Password::sendResetLink(['email' => $user->email]);
    
    if ($status === Password::RESET_LINK_SENT) {
        echo "✓ Password reset email sent successfully!\n";
        echo "✓ Check your Mailtrap inbox at: https://mailtrap.io/inboxes\n\n";
        echo "Email Details:\n";
        echo "- Branding: codefolio\n";
        echo "- Button Color: Amber (#d97706)\n";
        echo "- Recipient: {$user->email}\n";
    } else {
        echo "✗ Failed to send password reset email.\n";
        echo "Status: {$status}\n";
    }
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
