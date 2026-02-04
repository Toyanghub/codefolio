<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class UpdateDisposableDomains extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:disposable-domains {--source=github}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the list of disposable email domains from external sources';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $source = $this->option('source');

        $this->info('Updating disposable email domains list...');

        try {
            $domains = match ($source) {
                'github' => $this->fetchFromGitHub(),
                default => throw new \InvalidArgumentException("Unknown source: {$source}"),
            };

            if (empty($domains)) {
                $this->error('No domains fetched!');
                return 1;
            }

            // Save to file
            $filePath = storage_path('app/disposable-email-domains.txt');
            $content = $this->generateFileContent($domains);
            
            file_put_contents($filePath, $content);

            // Clear cache
            Cache::forget('disposable_email_domains');

            $this->info("✅ Successfully updated {count($domains)} disposable email domains!");
            $this->info("File saved to: {$filePath}");

            return 0;
        } catch (\Exception $e) {
            $this->error('Failed to update domains: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Fetch disposable domains from GitHub repository
     */
    protected function fetchFromGitHub(): array
    {
        $this->info('Fetching from GitHub repository...');

        // Using a well-maintained disposable email domains list
        $url = 'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf';

        $response = Http::timeout(30)->get($url);

        if (!$response->successful()) {
            throw new \Exception('Failed to fetch from GitHub: ' . $response->status());
        }

        $content = $response->body();
        
        // Parse domains (one per line)
        $domains = array_filter(
            array_map('trim', explode("\n", $content)),
            fn($domain) => !empty($domain) && !str_starts_with($domain, '#')
        );

        return array_values($domains);
    }

    /**
     * Generate file content with header and domains
     */
    protected function generateFileContent(array $domains): string
    {
        $date = now()->format('Y-m-d');
        $count = count($domains);

        $header = <<<HEADER
# Disposable Email Domains List
# Last updated: {$date}
# Total domains: {$count}
# This file contains known temporary/disposable email service domains
# Format: One domain per line
# Lines starting with # are comments

HEADER;

        return $header . implode("\n", $domains) . "\n";
    }
}
