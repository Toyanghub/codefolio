<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Password;
use App\Models\User;

// Check if email argument is provided
$testEmail = $argv[1] ?? null;

try {
    if ($testEmail) {
        // Test with provided email
        echo "Testing password reset email for: {$testEmail}\n\n";
        
        $status = Password::sendResetLink(['email' => $testEmail]);
        
        if ($status === Password::RESET_LINK_SENT) {
            echo "✓ Password reset email sent successfully!\n";
            echo "✓ Check the Gmail inbox for: {$testEmail}\n\n";
            echo "Email Details:\n";
            echo "- From: " . config('mail.from.address') . "\n";
            echo "- Branding: codefolio\n";
            echo "- Button Color: Amber (#d97706)\n";
        } else {
            echo "✗ Failed to send password reset email.\n";
            echo "Reason: {$status}\n";
            if ($status === Password::INVALID_USER) {
                echo "\nℹ User not found in database. Make sure this email exists in your users table.\n";
            }
        }
    } else {
        // Find the first user
        $user = User::first();
        
        if (!$user) {
            echo "✗ No users found in database.\n";
            echo "Usage: php test-password-reset.php user@gmail.com\n";
            exit(1);
        }
        
        echo "Testing password reset email for first user: {$user->email}\n\n";
        
        $status = Password::sendResetLink(['email' => $user->email]);
        
        if ($status === Password::RESET_LINK_SENT) {
            echo "✓ Password reset email sent successfully!\n";
            echo "✓ Check the Gmail inbox for: {$user->email}\n\n";
            echo "Email Details:\n";
            echo "- From: " . config('mail.from.address') . "\n";
            echo "- Branding: codefolio\n";
            echo "- Button Color: Amber (#d97706)\n";
        } else {
            echo "✗ Failed to send password reset email.\n";
            echo "Status: {$status}\n";
        }
    }
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n\n";
    echo "Common Issues:\n";
    echo "- Gmail App Password not configured correctly\n";
    echo "- Invalid credentials in .env file\n";
    echo "- Need to run: php artisan config:clear\n";
}
