<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if ($request->user()) {
            // Check if portfolio setup is not completed
            if (!$request->user()->portfolio_setup_completed) {
                // Don't redirect if already on portfolio settings page or logout route
                if (!$request->is('settings/portfolio*') && !$request->is('logout')) {
                    return redirect()->route('portfolio.edit')
                        ->with('info', 'Please complete your portfolio setup to get started!');
                }
            }
        }

        return $next($request);
    }
}
