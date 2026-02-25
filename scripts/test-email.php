<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    Mail::raw('This is a test email from Laravel', function ($message) {
        $message->to('test@example.com')
                ->subject('Test Email');
    });
    
    echo "✓ Email sent successfully to Mailtrap!\n";
    echo "Check your Mailtrap inbox at: https://mailtrap.io/inboxes\n";
} catch (\Exception $e) {
    echo "✗ Email failed: " . $e->getMessage() . "\n";
}
