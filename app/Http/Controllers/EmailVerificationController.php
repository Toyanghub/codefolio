<?php

namespace App\Http\Controllers;

use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {}

    /**
     * Display the email verification page
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        
        $remainingTime = $this->otpService->getRemainingTime($user);
        $canRequestOtp = $this->otpService->canRequestOtp($user);

        return Inertia::render('auth/verify-email-otp', [
            'remainingTime' => $remainingTime,
            'canRequestOtp' => $canRequestOtp['can_request'],
            'rateLimitMessage' => $canRequestOtp['message'],
        ]);
    }

    /**
     * Verify the OTP code
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();
        $result = $this->otpService->verifyOtp($user, $request->otp);

        if ($result['success']) {
            return redirect()->intended(route('home'))
                ->with('success', $result['message']);
        }

        return back()->withErrors([
            'otp' => $result['message'],
        ]);
    }

    /**
     * Resend OTP code
     */
    public function resendOtp(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        $canRequest = $this->otpService->canRequestOtp($user);
        
        if (!$canRequest['can_request']) {
            return back()->withErrors([
                'otp' => $canRequest['message'],
            ]);
        }

        $sent = $this->otpService->generateAndSendOtp($user);

        if ($sent) {
            return back()->with('success', 'A new verification code has been sent to your email.');
        }

        return back()->withErrors([
            'otp' => 'Failed to send verification code. Please try again later.',
        ]);
    }
}
