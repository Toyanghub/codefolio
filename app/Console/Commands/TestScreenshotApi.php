<?php

namespace App\Console\Commands;

use App\Services\ScreenshotService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class TestScreenshotApi extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'screenshot:test {url=https://example.com : The URL to test screenshot capture}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the Screenshot API configuration and verify it works';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Testing Screenshot API Configuration...');
        $this->newLine();

        // Check if API key is configured
        $apiKey = config('services.screenshot.api_key');
        
        if (!$apiKey) {
            $this->error('❌ SCREENSHOT_API_KEY is not configured in .env file');
            return Command::FAILURE;
        }

        $this->info("✅ API Key found: " . substr($apiKey, 0, 7) . "..." . substr($apiKey, -7));
        $this->newLine();

        // Test URL
        $testUrl = $this->argument('url');
        $this->info("🌐 Test URL: {$testUrl}");
        $this->newLine();

        // Test API request
        $this->info('📸 Making test request to Screenshot API...');
        
        try {
            $response = Http::timeout(30)->get('https://shot.screenshotapi.net/screenshot', [
                'token' => $apiKey,
                'url' => $testUrl,
                'width' => 1920,
                'height' => 1080,
                'output' => 'json', // Get JSON response for testing
                'file_type' => 'png',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $this->newLine();
                $this->info('✅ API Key is VALID and working!');
                $this->newLine();
                $this->line('📊 Response Details:');
                $this->line('   Screenshot URL: ' . ($data['screenshot'] ?? 'N/A'));
                $this->newLine();
                
                // Now test full screenshot generation
                $this->info('🎨 Testing full screenshot generation (desktop + mobile)...');
                $screenshotService = new ScreenshotService();
                $result = $screenshotService->generateScreenshots($testUrl);
                
                if ($result['error']) {
                    $this->error('❌ Screenshot generation failed: ' . $result['error']);
                    return Command::FAILURE;
                }
                
                $this->newLine();
                $this->info('✅ Screenshots generated successfully!');
                $this->line('   Desktop: ' . ($result['desktop'] ?? 'N/A'));
                $this->line('   Mobile: ' . ($result['mobile'] ?? 'N/A'));
                $this->newLine();
                
                return Command::SUCCESS;
            } else {
                $this->error('❌ API request failed!');
                $this->error('   Status: ' . $response->status());
                $this->error('   Response: ' . $response->body());
                $this->newLine();
                $this->warn('💡 Possible issues:');
                $this->warn('   - Invalid API key');
                $this->warn('   - API quota exceeded');
                $this->warn('   - API service is down');
                
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error('❌ Exception occurred: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
