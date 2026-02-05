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

class GitHubAuthController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {}

    /**
     * Redirect the user to the GitHub authentication page.
     */
    public function redirectToGitHub()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     */
    public function handleGitHubCallback()
    {
        try {
            $githubUser = Socialite::driver('github')->user();
            
            // Find user by GitHub ID or email
            $user = User::where('github_id', $githubUser->id)
                ->orWhere('email', $githubUser->email)
                ->first();

            if ($user) {
                // Update GitHub ID if not already set
                if (!$user->github_id) {
                    $user->github_id = $githubUser->id;
                }
                // Always update the GitHub avatar when logging in with OAuth
                if ($githubUser->avatar) {
                    $avatarPath = $this->downloadGitHubAvatar($githubUser->avatar, $githubUser->id);
                    if ($avatarPath) {
                        // Delete old avatar if exists
                        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                            Storage::disk('public')->delete($user->avatar);
                        }
                        $user->avatar = $avatarPath;
                    }
                }
                
                // Set email_verified to false to require OTP verification
                $user->email_verified = false;
                $user->save();
            } else {
                // Download and store the GitHub profile picture
                $avatar = null;
                if ($githubUser->avatar) {
                    $avatar = $this->downloadGitHubAvatar($githubUser->avatar, $githubUser->id);
                }

                // Create new user with email_verified = false
                $user = User::create([
                    'name' => $githubUser->name ?? $githubUser->nickname ?? 'GitHub User',
                    'email' => $githubUser->email,
                    'github_id' => $githubUser->id,
                    'avatar' => $avatar,
                    'password' => Hash::make(Str::random(24)), // Random password for OAuth users
                    'email_verified_at' => now(), // Keep for compatibility
                    'email_verified' => false, // Require OTP verification
                ]);
            }

            // Generate and send OTP
            $this->otpService->generateAndSendOtp($user);

            // Log the user in
            Auth::login($user, true);

            // Redirect to OTP verification page
            return redirect()->route('verify-otp')
                ->with('success', 'Please verify your email with the code we just sent to ' . $user->email);
            
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Unable to authenticate with GitHub. Please try again.');
        }
    }

    /**
     * Download and store GitHub avatar locally
     */
    private function downloadGitHubAvatar(string $avatarUrl, string $githubId): ?string
    {
        try {
            // Download the image
            $imageContent = file_get_contents($avatarUrl);
            
            if ($imageContent === false) {
                return null;
            }

            // Generate a unique filename
            $extension = 'png'; // GitHub avatars are typically PNG
            $filename = 'github-avatars/' . $githubId . '_' . time() . '.' . $extension;

            // Store in public disk
            Storage::disk('public')->put($filename, $imageContent);

            return $filename;
        } catch (\Exception $e) {
            // If download fails, return null (user will get initials instead)
            return null;
        }
    }
}
