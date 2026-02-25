<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ThrottleRegistration
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only throttle POST requests (actual registration)
        if ($request->isMethod('POST')) {
            $key = 'register:' . $request->ip();
            
            // 3 attempts per hour per IP
            if (RateLimiter::tooManyAttempts($key, 3)) {
                $seconds = RateLimiter::availableIn($key);
                $minutes = ceil($seconds / 60);
                
                return back()->withErrors([
                    'email' => "Too many registration attempts. Please try again in {$minutes} minutes."
                ]);
            }
            
            RateLimiter::hit($key, 3600); // 1 hour decay
        }
        
        return $next($request);
    }
}
