<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {}

    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Find user by Google ID or email (including soft-deleted users)
            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->withTrashed()
                ->first();

            if ($user) {
                // If user was soft-deleted, restore them
                if ($user->trashed()) {
                    $user->restore();
                    \Log::info('Restored soft-deleted user via Google OAuth', [
                        'user_id' => $user->id,
                        'email' => $user->email
                    ]);
                }
                
                // Update Google ID if not already set
                if (!$user->google_id) {
                    $user->google_id = $googleUser->id;
                }
                // Always update the Google avatar when logging in with OAuth
                if ($googleUser->avatar) {
                    $avatarPath = $this->downloadGoogleAvatar($googleUser->avatar, $googleUser->id);
                    if ($avatarPath) {
                        // Delete old Google avatar if exists
                        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                            Storage::disk('public')->delete($user->avatar);
                        }
                        $user->avatar = $avatarPath;
                    }
                }
                
                $user->save();
                
                // Check if user is already verified
                if ($user->email_verified) {
                    // Existing verified user - skip OTP and go directly to home
                    Auth::login($user, true);
                    return redirect()->intended('/')
                        ->with('success', 'Welcome back, ' . $user->name . '!');
                }
                
                // User exists but not verified - require OTP verification
                // (email_verified remains false, will be caught by middleware)
            } else {
                // Download and store the Google profile picture
                $avatar = null;
                if ($googleUser->avatar) {
                    $avatar = $this->downloadGoogleAvatar($googleUser->avatar, $googleUser->id);
                }

                // Create new user with email_verified = false
                \Log::info('Creating new Google OAuth user', ['email' => $googleUser->email]);
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $avatar,
                    'password' => Hash::make(Str::random(24)), // Random password for OAuth users
                    'email_verified_at' => now(), // Keep for compatibility
                    'email_verified' => false, // Require OTP verification
                ]);
                \Log::info('New Google OAuth user created', ['user_id' => $user->id]);
            }

            // Only generate and send OTP for unverified users (new or existing unverified)
            if (!$user->email_verified) {
                \Log::info('Generating OTP for unverified user', ['user_id' => $user->id]);
                $this->otpService->generateAndSendOtp($user);
                \Log::info('OTP generated and queued', ['user_id' => $user->id]);
                
                // Log the user in
                Auth::login($user, true);
                \Log::info('User logged in via Google OAuth', ['user_id' => $user->id]);
                
                // Redirect to OTP verification page
                \Log::info('Redirecting to OTP verification page', ['user_id' => $user->id]);
                return redirect()->route('verify-otp')
                    ->with('success', 'Please verify your email with the code we just sent to ' . $user->email);
            }
            
            // This should never be reached due to the check above, but just in case
            Auth::login($user, true);
            return redirect()->intended('/');
            
        } catch (\Exception $e) {
            // Log the full exception for debugging
            \Log::error('Google OAuth failed: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            
            return redirect('/login')->with('error', 'Unable to authenticate with Google. Please try again.');
        }
    }

    /**
     * Download and store Google avatar locally
     */
    private function downloadGoogleAvatar(string $avatarUrl, string $googleId): ?string
    {
        try {
            // Download the image
            $imageContent = file_get_contents($avatarUrl);
            
            if ($imageContent === false) {
                return null;
            }

            // Generate a unique filename
            $extension = 'jpg'; // Google avatars are typically JPG
            $filename = 'google-avatars/' . $googleId . '_' . time() . '.' . $extension;

            // Store in public disk
            Storage::disk('public')->put($filename, $imageContent);

            return $filename;
        } catch (\Exception $e) {
            // If download fails, return null (user will get initials instead)
            return null;
        }
    }
}
