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

        // Only check verification for authenticated users
        if (!$user) {
            return $next($request);
        }

        // Get the current route name and path
        $routeName = $request->route()?->getName();
        $path = $request->path();

        // Routes that unverified users can access
        $allowedRoutes = [
            'verify-otp',
            'verify-otp.verify',
            'verify-otp.resend',
            'logout',
            // Auth routes - allow authenticated-but-unverified users to logout and re-authenticate
            'login',
            'login.store',
            'register',
            'register.store',
            'password.request',
            'password.email',
            'password.reset',
            'password.update',
            'two-factor.login',
            'two-factor.login.store',
            'two-factor.enable',
            'two-factor.confirm',
            'two-factor.disable',
            // OAuth routes
            'auth.google',
            'auth.github',
        ];

        // Allowed path prefixes (for routes without names, like OAuth callbacks)
        $allowedPathPrefixes = [
            'auth/google',
            'auth/github',
        ];

        // Check if current route/path is allowed
        $isAllowed = in_array($routeName, $allowedRoutes) || 
                     collect($allowedPathPrefixes)->contains(fn($prefix) => str_starts_with($path, $prefix));

        // If user is authenticated but not verified, and not on allowed route
        if (!$isAllowed) {
            // Get fresh user data from database to avoid stale session data
            $user = $user->fresh();
            
            if (!$user->email_verified) {
                return redirect()->route('verify-otp');
            }
        }

        return $next($request);
    }
}
