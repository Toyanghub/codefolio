<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaV3 implements ValidationRule
{
    protected float $scoreThreshold;

    /**
     * Create a new rule instance.
     *
     * @param float $scoreThreshold Minimum score required (0.0 to 1.0)
     */
    public function __construct(float $scoreThreshold = 0.5)
    {
        $this->scoreThreshold = $scoreThreshold;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Check if reCAPTCHA is enabled
        $secretKey = config('services.recaptcha.secret_key');
        
        if (empty($secretKey)) {
            Log::warning('reCAPTCHA secret key not configured');
            $fail('reCAPTCHA is not properly configured.');
            return;
        }

        if (empty($value)) {
            $fail('The reCAPTCHA verification failed. Please try again.');
            return;
        }

        try {
            // Verify the token with Google's API
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretKey,
                'response' => $value,
                'remoteip' => request()->ip(),
            ]);

            // @phpstan-ignore-next-line - Laravel Http facade Response has json() method
            $result = $response->json();

            // Check if verification was successful
            if (!$result['success']) {
                Log::warning('reCAPTCHA verification failed', [
                    'error_codes' => $result['error-codes'] ?? [],
                    'ip' => request()->ip(),
                ]);
                $fail('The reCAPTCHA verification failed. Please try again.');
                return;
            }

            // Check the score (v3 returns a score between 0.0 and 1.0)
            $score = $result['score'] ?? 0;
            
            if ($score < $this->scoreThreshold) {
                Log::warning('reCAPTCHA score too low', [
                    'score' => $score,
                    'threshold' => $this->scoreThreshold,
                    'ip' => request()->ip(),
                ]);
                $fail('Your request appears suspicious. Please try again later.');
                return;
            }

            // Log successful verification
            Log::info('reCAPTCHA verification successful', [
                'score' => $score,
                'ip' => request()->ip(),
            ]);

        } catch (\Exception $e) {
            Log::error('reCAPTCHA verification error', [
                'error' => $e->getMessage(),
                'ip' => request()->ip(),
            ]);
            $fail('Unable to verify reCAPTCHA. Please try again.');
        }
    }
}
