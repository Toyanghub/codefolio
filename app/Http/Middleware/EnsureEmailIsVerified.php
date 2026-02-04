<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Get fresh user data from database to avoid stale session data
        if ($user) {
            $user = $user->fresh();
            
            if (!$user->email_verified) {
                return redirect()->guest(route('verify-otp'));
            }
        }

        return $next($request);
    }
}
