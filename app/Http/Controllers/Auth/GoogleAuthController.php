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
            
            // Find user by Google ID or email
            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if ($user) {
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
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $avatar,
                    'password' => Hash::make(Str::random(24)), // Random password for OAuth users
                    'email_verified_at' => now(), // Keep for compatibility
                    'email_verified' => false, // Require OTP verification
                ]);
            }

            // Only generate and send OTP for unverified users (new or existing unverified)
            if (!$user->email_verified) {
                $this->otpService->generateAndSendOtp($user);
                
                // Log the user in
                Auth::login($user, true);
                
                // Redirect to OTP verification page
                return redirect()->route('verify-otp')
                    ->with('success', 'Please verify your email with the code we just sent to ' . $user->email);
            }
            
            // This should never be reached due to the check above, but just in case
            Auth::login($user, true);
            return redirect()->intended('/');
            
        } catch (\Exception $e) {
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
