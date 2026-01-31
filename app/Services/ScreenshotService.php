<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ScreenshotService
{
    /**
     * Generate screenshots using ScreenshotAPI (free tier available).
     * 
     * Alternative services:
     * - ApiFlash: https://apiflash.com
     * - Urlbox: https://urlbox.io
     * - ScreenshotOne: https://screenshotone.com
     */
    
    /**
     * Generate desktop and mobile screenshots for a given URL.
     *
     * @param string $url The website URL to capture
     * @return array{desktop: string|null, mobile: string|null, error: string|null}
     */
    public function generateScreenshots(string $url): array
    {
        try {
            // Validate URL format
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                return [
                    'desktop' => null,
                    'mobile' => null,
                    'error' => 'Invalid URL format',
                ];
            }

            // Generate both screenshots
            $desktopPath = $this->captureDesktop($url);
            $mobilePath = $this->captureMobile($url);

            if (!$desktopPath || !$mobilePath) {
                return [
                    'desktop' => $desktopPath,
                    'mobile' => $mobilePath,
                    'error' => 'Failed to generate one or more screenshots',
                ];
            }

            return [
                'desktop' => $desktopPath,
                'mobile' => $mobilePath,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('Screenshot generation failed', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);

            return [
                'desktop' => null,
                'mobile' => null,
                'error' => 'Screenshot generation failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Capture desktop screenshot (1920x1080).
     */
    private function captureDesktop(string $url): ?string
    {
        return $this->captureScreenshot($url, [
            'width' => 1920,
            'height' => 1080,
            'device' => 'desktop',
        ]);
    }

    /**
     * Capture mobile screenshot (375x667 - iPhone SE).
     */
    private function captureMobile(string $url): ?string
    {
        return $this->captureScreenshot($url, [
            'width' => 375,
            'height' => 667,
            'device' => 'mobile',
        ]);
    }

    /**
     * Capture screenshot using ScreenshotAPI or fallback method.
     */
    private function captureScreenshot(string $url, array $options): ?string
    {
        $apiKey = config('services.screenshot.api_key');

        if ($apiKey) {
            return $this->captureWithApi($url, $options, $apiKey);
        }

        // Fallback to simple HTTP request (basic screenshot)
        return $this->captureWithFallback($url, $options);
    }

    /**
     * Capture screenshot using ScreenshotAPI.
     */
    private function captureWithApi(string $url, array $options, string $apiKey): ?string
    {
        try {
            $response = Http::timeout(30)->get('https://shot.screenshotapi.net/screenshot', [
                'token' => $apiKey,
                'url' => $url,
                'width' => $options['width'],
                'height' => $options['height'],
                'output' => 'image',
                'file_type' => 'png',
                'wait_for_event' => 'load',
                'delay' => 1000, // Wait 1 second after load
                'fresh' => true, // Don't use cache
            ]);

            if ($response->successful()) {
                return $this->saveScreenshot($response->body(), $options['device']);
            }

            Log::warning('ScreenshotAPI request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('ScreenshotAPI exception', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Fallback method using a different service or placeholder.
     */
    private function captureWithFallback(string $url, array $options): ?string
    {
        try {
            // Use a free alternative service as fallback
            // Note: This is a demo service and may have rate limits
            $response = Http::timeout(30)->get('https://api.apiflash.com/v1/urltoimage', [
                'access_key' => 'demo', // Replace with actual API key
                'url' => $url,
                'width' => $options['width'],
                'height' => $options['height'],
                'format' => 'png',
                'response_type' => 'image',
            ]);

            if ($response->successful()) {
                return $this->saveScreenshot($response->body(), $options['device']);
            }

            // If all methods fail, log the error
            Log::warning('Fallback screenshot capture failed', [
                'url' => $url,
                'device' => $options['device'],
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Fallback screenshot exception', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Save screenshot to storage.
     */
    private function saveScreenshot(string $imageData, string $device): ?string
    {
        try {
            $filename = sprintf(
                '%s_%s_%s.png',
                $device,
                auth()->id(),
                now()->timestamp
            );

            $path = "portfolio-screenshots/{$filename}";

            Storage::disk('public')->put($path, $imageData);

            return $path;
        } catch (\Exception $e) {
            Log::error('Failed to save screenshot', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Delete old screenshot files to save storage.
     */
    public function cleanupOldScreenshots(int $userId): void
    {
        try {
            $prefix = "portfolio-screenshots";
            $files = Storage::disk('public')->files($prefix);

            foreach ($files as $file) {
                // Delete files for this user that are older than 1 hour
                if (str_contains($file, "_{$userId}_")) {
                    $fileTime = Storage::disk('public')->lastModified($file);
                    if (time() - $fileTime > 3600) {
                        Storage::disk('public')->delete($file);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Failed to cleanup old screenshots', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
