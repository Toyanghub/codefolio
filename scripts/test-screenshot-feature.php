#!/usr/bin/env php
<?php

/**
 * Test Script for Screenshot Generation Feature
 * 
 * Usage: php scripts/test-screenshot-feature.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🔍 Screenshot Feature Diagnostic Tool\n";
echo "=====================================\n\n";

// 1. Check API Key Configuration
echo "1️⃣  Checking API Key Configuration...\n";
$apiKey = config('services.screenshot.api_key');
if ($apiKey) {
    echo "   ✅ API Key is configured: " . substr($apiKey, 0, 7) . "..." . substr($apiKey, -7) . "\n";
} else {
    echo "   ❌ API Key is NOT configured!\n";
    echo "   💡 Add SCREENSHOT_API_KEY to your .env file\n";
    exit(1);
}
echo "\n";

// 2. Check Queue Configuration
echo "2️⃣  Checking Queue Configuration...\n";
$queueDriver = config('queue.default');
echo "   Queue Driver: {$queueDriver}\n";

if ($queueDriver === 'sync') {
    echo "   ⚠️  WARNING: Queue driver is 'sync' (jobs run immediately)\n";
    echo "   💡 This is OK for testing, but for production use 'database' or 'redis'\n";
} else {
    echo "   ✅ Queue driver is configured for async processing\n";
}
echo "\n";

// 3. Check if Queue Worker is Running
echo "3️⃣  Checking Queue Worker Status...\n";
$queueWorkerCheck = shell_exec('ps aux | grep "queue:work\|queue:listen" | grep -v grep');
if ($queueWorkerCheck) {
    echo "   ✅ Queue worker is running\n";
    echo "   " . trim($queueWorkerCheck) . "\n";
} else {
    echo "   ❌ Queue worker is NOT running!\n";
    echo "   💡 Start it with: php artisan queue:work\n";
    echo "   💡 Or for production: php artisan queue:listen --daemon\n";
}
echo "\n";

// 4. Check Storage Permissions
echo "4️⃣  Checking Storage Permissions...\n";
$storagePath = storage_path('app/public/portfolio-screenshots');
if (!is_dir($storagePath)) {
    echo "   📁 Creating directory: {$storagePath}\n";
    mkdir($storagePath, 0755, true);
}

if (is_writable($storagePath)) {
    echo "   ✅ Storage directory is writable\n";
    echo "   📁 {$storagePath}\n";
} else {
    echo "   ❌ Storage directory is NOT writable!\n";
    echo "   💡 Fix permissions: chmod -R 775 storage/app/public\n";
}
echo "\n";

// 5. Test API Connection
echo "5️⃣  Testing Screenshot API Connection...\n";
try {
    $response = \Illuminate\Support\Facades\Http::timeout(30)->get('https://shot.screenshotapi.net/screenshot', [
        'token' => $apiKey,
        'url' => 'https://example.com',
        'width' => 1920,
        'height' => 1080,
        'output' => 'json',
        'file_type' => 'png',
    ]);

    if ($response->successful()) {
        echo "   ✅ API is responding correctly!\n";
        $data = $response->json();
        echo "   📸 Screenshot URL: " . ($data['screenshot'] ?? 'N/A') . "\n";
    } else {
        echo "   ❌ API request failed!\n";
        echo "   Status: " . $response->status() . "\n";
        echo "   Response: " . $response->body() . "\n";
    }
} catch (Exception $e) {
    echo "   ❌ Exception: " . $e->getMessage() . "\n";
}
echo "\n";

// 6. Check Recent Jobs
echo "6️⃣  Checking Recent Failed Jobs...\n";
$failedJobs = \Illuminate\Support\Facades\DB::table('failed_jobs')
    ->where('payload', 'like', '%GeneratePortfolioScreenshots%')
    ->orderBy('failed_at', 'desc')
    ->limit(3)
    ->get();

if ($failedJobs->count() > 0) {
    echo "   ⚠️  Found " . $failedJobs->count() . " failed screenshot jobs:\n";
    foreach ($failedJobs as $job) {
        echo "   - Failed at: {$job->failed_at}\n";
        $payload = json_decode($job->payload, true);
        echo "     Exception: " . substr($job->exception, 0, 200) . "...\n";
    }
} else {
    echo "   ✅ No failed screenshot jobs found\n";
}
echo "\n";

// 7. Summary and Recommendations
echo "7️⃣  Summary & Recommendations\n";
echo "=====================================\n";

$issues = [];

if (!$apiKey) {
    $issues[] = "Configure SCREENSHOT_API_KEY in .env";
}

if (!$queueWorkerCheck && $queueDriver !== 'sync') {
    $issues[] = "Start queue worker: php artisan queue:work";
}

if (!is_writable($storagePath)) {
    $issues[] = "Fix storage permissions: chmod -R 775 storage/app/public";
}

if (empty($issues)) {
    echo "✅ All checks passed! Screenshot feature should work.\n\n";
    echo "📝 Testing Steps:\n";
    echo "   1. Go to https://codefolio.space/settings/portfolio\n";
    echo "   2. Enter your website URL\n";
    echo "   3. Click 'Generate from URL'\n";
    echo "   4. Wait 1-2 minutes and refresh the page\n";
    echo "   5. Screenshots should appear\n\n";
    echo "🔍 To monitor in real-time:\n";
    echo "   tail -f storage/logs/laravel.log | grep screenshot\n\n";
} else {
    echo "⚠️  Issues found:\n";
    foreach ($issues as $issue) {
        echo "   - {$issue}\n";
    }
    echo "\n";
}

echo "=====================================\n";
echo "✨ Diagnostic complete!\n";
