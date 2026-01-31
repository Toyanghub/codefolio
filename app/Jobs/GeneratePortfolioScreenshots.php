<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\ScreenshotService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class GeneratePortfolioScreenshots implements ShouldQueue
{
    use Queueable;

    public int $timeout = 120; // 2 minutes timeout
    public int $tries = 2; // Retry once on failure

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public string $url,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ScreenshotService $screenshotService): void
    {
        Log::info('Starting screenshot generation', [
            'user_id' => $this->user->id,
            'url' => $this->url,
        ]);

        // Generate screenshots
        $result = $screenshotService->generateScreenshots($this->url);

        if ($result['error']) {
            Log::error('Screenshot generation failed', [
                'user_id' => $this->user->id,
                'error' => $result['error'],
            ]);
            throw new \Exception($result['error']);
        }

        // Update user's portfolio images
        $this->user->update([
            'portfolio_desktop_image' => $result['desktop'],
            'portfolio_mobile_image' => $result['mobile'],
        ]);

        // Cleanup old screenshots
        $screenshotService->cleanupOldScreenshots($this->user->id);

        Log::info('Screenshot generation completed', [
            'user_id' => $this->user->id,
            'desktop' => $result['desktop'],
            'mobile' => $result['mobile'],
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Screenshot generation job failed', [
            'user_id' => $this->user->id,
            'url' => $this->url,
            'error' => $exception->getMessage(),
        ]);
    }
}
