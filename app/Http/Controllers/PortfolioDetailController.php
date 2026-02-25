<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioDetailController extends Controller
{
    /**
     * Display the specified portfolio.
     */
    public function show($id)
    {
        $user = User::with(['skills', 'techStacks', 'professions'])
            ->where('id', $id)
            ->where('portfolio_published', true)
            ->whereNotNull('portfolio_desktop_image')
            ->first();

        if (!$user) {
            abort(404, 'Portfolio not found or not published');
        }

        // Increment portfolio views
        $user->increment('portfolio_views');

        // Prioritize Google avatar, fall back to profile_picture
        $profilePicture = $user->avatar ?? $user->profile_picture;

        $portfolio = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profilePicture' => $profilePicture,
            'desktopImage' => $user->portfolio_desktop_image,
            'mobileImage' => $user->portfolio_mobile_image,
            'description' => $user->portfolio_description,
            'websiteUrl' => $user->website_url,
            'skills' => $user->skills->pluck('name')->toArray(),
            'techStack' => $user->techStacks->pluck('name')->toArray(),
            'professions' => $user->professions->pluck('name')->toArray(),
            'createdAt' => $user->created_at->format('F Y'),
            'isFeatured' => $user->is_featured ?? false,
            'views' => $user->portfolio_views,
        ];

        return Inertia::render('portfolio-detail', [
            'portfolio' => $portfolio,
        ]);
    }
}
