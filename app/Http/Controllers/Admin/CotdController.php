<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CotdController extends Controller
{
    /**
     * Display the admin COTD management page.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $filter = $request->input('filter', 'all'); // all, featured, not_featured, recent
        
        // Get all users with published portfolios
        $query = User::query()
            ->whereNotNull('portfolio_desktop_image')
            ->where('portfolio_published', true)
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            });
        
        // Apply filter
        switch ($filter) {
            case 'featured':
                // Currently featured portfolios
                $query->where('is_featured', true);
                break;
            case 'not_featured':
                // Never been featured (featured_at is null)
                $query->whereNull('featured_at');
                break;
            case 'recent':
                // Featured within last 30 days
                $query->where('featured_at', '>=', now()->subDays(30));
                break;
            case 'all':
            default:
                // Show all portfolios
                break;
        }
        
        $portfolios = $query
            ->with(['skills', 'techStacks', 'professions'])
            ->orderByDesc('is_featured')
            ->orderByDesc('featured_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($user) {
                // Prioritize Google avatar, fall back to profile_picture
                $profilePicture = $user->avatar ?? $user->profile_picture;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile_picture' => $profilePicture,
                    'portfolio_desktop_image' => $user->portfolio_desktop_image,
                    'portfolio_mobile_image' => $user->portfolio_mobile_image,
                    'website_url' => $user->website_url,
                    'portfolio_description' => $user->portfolio_description,
                    'is_featured' => $user->is_featured,
                    'featured_at' => $user->featured_at,
                    'skills' => $user->skills->pluck('name')->toArray(),
                    'techStack' => $user->techStacks->pluck('name')->toArray(),
                    'professions' => $user->professions->pluck('name')->toArray(),
                ];
            });

        return Inertia::render('admin/cotd', [
            'portfolios' => $portfolios,
            'search' => $search,
            'filter' => $filter,
        ]);
    }

    /**
     * Toggle featured status for a user's portfolio.
     */
    public function toggleFeatured(Request $request, User $user)
    {
        $request->validate([
            'is_featured' => ['required', 'boolean'],
        ]);

        $user->update([
            'is_featured' => $request->is_featured,
            'featured_at' => $request->is_featured ? now() : null,
        ]);

        return back()->with('success', $request->is_featured 
            ? "Portfolio featured successfully!" 
            : "Portfolio unfeatured successfully!");
    }
}
