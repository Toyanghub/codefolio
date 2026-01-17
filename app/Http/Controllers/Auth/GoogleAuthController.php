<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
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
                // Update Google ID and avatar if not already set
                if (!$user->google_id) {
                    $user->google_id = $googleUser->id;
                }
                // Always update the profile picture from Google if user doesn't have one
                if (!$user->profile_picture && $googleUser->avatar) {
                    $user->profile_picture = $this->downloadGoogleAvatar($googleUser->avatar, $googleUser->id);
                }
                $user->save();
            } else {
                // Download and store the Google profile picture
                $profilePicture = null;
                if ($googleUser->avatar) {
                    $profilePicture = $this->downloadGoogleAvatar($googleUser->avatar, $googleUser->id);
                }

                // Create new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'profile_picture' => $profilePicture,
                    'password' => Hash::make(Str::random(24)), // Random password for OAuth users
                    'email_verified_at' => now(), // Google accounts are already verified
                ]);
            }

            // Log the user in
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
