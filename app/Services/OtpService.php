<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\EmailOtpNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class OtpService
{
    /**
     * OTP expiration time in minutes
     */
    const OTP_EXPIRATION_MINUTES = 15;

    /**
     * Maximum OTP attempts allowed
     */
    const MAX_OTP_ATTEMPTS = 5;

    /**
     * Rate limit: Maximum OTP requests per hour
     */
    const MAX_OTP_REQUESTS_PER_HOUR = 3;

    /**
     * Generate and send OTP to user's email
     */
    public function generateAndSendOtp(User $user): bool
    {
        // Check rate limiting
        if (!$this->checkRateLimit($user)) {
            return false;
        }

        // Generate 6-digit OTP
        $otp = $this->generateOtp();

        // Save OTP to user
        $user->update([
            'email_otp' => $otp,
            'email_otp_expires_at' => Carbon::now()->addMinutes(self::OTP_EXPIRATION_MINUTES),
            'email_otp_attempts' => 0,
        ]);

        // Send OTP via email
        $user->notify(new EmailOtpNotification($otp));

        // Increment rate limit counter
        $this->incrementRateLimitCounter($user);

        return true;
    }

    /**
     * Verify OTP code
     */
    public function verifyOtp(User $user, string $otp): array
    {
        // Check if OTP exists
        if (!$user->email_otp) {
            return [
                'success' => false,
                'message' => 'No OTP found. Please request a new one.',
            ];
        }

        // Check if OTP is expired
        if (Carbon::now()->isAfter($user->email_otp_expires_at)) {
            return [
                'success' => false,
                'message' => 'OTP has expired. Please request a new one.',
            ];
        }

        // Check if maximum attempts reached
        if ($user->email_otp_attempts >= self::MAX_OTP_ATTEMPTS) {
            return [
                'success' => false,
                'message' => 'Maximum verification attempts reached. Please request a new OTP.',
            ];
        }

        // Increment attempts
        $user->increment('email_otp_attempts');

        // Verify OTP
        if ($user->email_otp !== $otp) {
            $remainingAttempts = self::MAX_OTP_ATTEMPTS - $user->email_otp_attempts;
            
            return [
                'success' => false,
                'message' => "Invalid OTP. You have {$remainingAttempts} attempts remaining.",
            ];
        }

        // OTP is valid - mark email as verified
        $user->update([
            'email_verified' => true,
            'email_otp' => null,
            'email_otp_expires_at' => null,
            'email_otp_attempts' => 0,
        ]);

        return [
            'success' => true,
            'message' => 'Email verified successfully!',
        ];
    }

    /**
     * Generate a random 6-digit OTP
     */
    protected function generateOtp(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Check rate limiting for OTP requests
     */
    protected function checkRateLimit(User $user): bool
    {
        $key = "otp_requests:{$user->id}";
        $requests = Cache::get($key, 0);

        return $requests < self::MAX_OTP_REQUESTS_PER_HOUR;
    }

    /**
     * Increment rate limit counter
     */
    protected function incrementRateLimitCounter(User $user): void
    {
        $key = "otp_requests:{$user->id}";
        $requests = Cache::get($key, 0);
        
        Cache::put($key, $requests + 1, Carbon::now()->addHour());
    }

    /**
     * Get remaining time for OTP expiration
     */
    public function getRemainingTime(User $user): ?int
    {
        if (!$user->email_otp_expires_at) {
            return null;
        }

        $expiresAt = Carbon::parse($user->email_otp_expires_at);
        
        if (Carbon::now()->isAfter($expiresAt)) {
            return 0;
        }

        return Carbon::now()->diffInSeconds($expiresAt);
    }

    /**
     * Check if user can request a new OTP
     */
    public function canRequestOtp(User $user): array
    {
        if (!$this->checkRateLimit($user)) {
            return [
                'can_request' => false,
                'message' => 'Too many OTP requests. Please try again later.',
            ];
        }

        return [
            'can_request' => true,
            'message' => null,
        ];
    }
}
