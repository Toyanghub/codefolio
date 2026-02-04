<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NotDisposableEmail implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            return;
        }

        // Extract domain from email
        $domain = strtolower(substr(strrchr($value, '@'), 1));

        if (empty($domain)) {
            return;
        }

        // Check if domain is in disposable list
        if ($this->isDisposableDomain($domain)) {
            $fail('The :attribute must be from a legitimate email provider. Temporary or disposable email addresses are not allowed.');
        }
    }

    /**
     * Check if the domain is a known disposable email provider
     */
    protected function isDisposableDomain(string $domain): bool
    {
        $disposableDomainsFile = storage_path('app/disposable-email-domains.txt');

        // If file doesn't exist, return false (fail open for availability)
        if (!file_exists($disposableDomainsFile)) {
            \Log::warning('Disposable email domains file not found');
            return false;
        }

        // Read and cache the domains list
        $domains = $this->getDisposableDomains($disposableDomainsFile);

        return in_array($domain, $domains, true);
    }

    /**
     * Get disposable domains list with caching
     */
    protected function getDisposableDomains(string $filePath): array
    {
        return cache()->remember('disposable_email_domains', now()->addDay(), function () use ($filePath) {
            $content = file_get_contents($filePath);
            
            // Split by newlines and filter empty lines
            $domains = array_filter(
                array_map('trim', explode("\n", $content)),
                fn($domain) => !empty($domain) && !str_starts_with($domain, '#')
            );

            return array_map('strtolower', $domains);
        });
    }
}
