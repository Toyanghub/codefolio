<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterWelcome;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     */
    public function subscribe(Request $request)
    {
        // Validate the email
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'nullable|string|max:255',
        ]);

        try {
            // Check if already subscribed and active
            $existing = NewsletterSubscription::where('email', $validated['email'])
                ->where('is_active', true)
                ->first();

            if ($existing) {
                return back()->with('message', 'You are already subscribed to our newsletter!');
            }

            // Subscribe the user
            $subscription = NewsletterSubscription::subscribe(
                $validated['email'],
                $validated['name'] ?? null,
                $request->ip()
            );

            // Send welcome email (queued automatically)
            Mail::to($subscription->email)->send(new NewsletterWelcome($subscription));

            Log::info('Newsletter subscription with email sent', [
                'email' => $validated['email'],
                'ip' => $request->ip()
            ]);

            return back()->with('message', 'Thank you for subscribing! Check your email for confirmation.');

        } catch (\Exception $e) {
            Log::error('Newsletter subscription failed', [
                'email' => $validated['email'],
                'error' => $e->getMessage()
            ]);

            return back()->withErrors(['email' => 'Something went wrong. Please try again later.']);
        }
    }

    /**
     * Unsubscribe from newsletter
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        try {
            $subscription = NewsletterSubscription::where('email', $validated['email'])->first();

            if (!$subscription) {
                return response()->json([
                    'message' => 'Email not found in our newsletter list.',
                    'status' => 'error'
                ], 404);
            }

            $subscription->unsubscribe();

            Log::info('Newsletter unsubscribe', [
                'email' => $validated['email'],
                'ip' => $request->ip()
            ]);

            return response()->json([
                'message' => 'You have been unsubscribed from our newsletter.',
                'status' => 'success'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Newsletter unsubscribe failed', [
                'email' => $validated['email'],
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Something went wrong. Please try again later.',
                'status' => 'error'
            ], 500);
        }
    }
}
