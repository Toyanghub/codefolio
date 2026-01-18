<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\TechStack;
use App\Models\Profession;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ObservatoryController extends Controller
{
    /**
     * Display the observatory page with filter options and published portfolios.
     */
    public function index(Request $request): Response
    {
        // Get published portfolios with their relationships
        $portfoliosQuery = User::where('portfolio_published', true)
            ->with(['skills', 'techStacks', 'professions'])
            ->whereNotNull('portfolio_desktop_image');

        // Apply search filter if provided
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $portfoliosQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('portfolio_description', 'like', "%{$search}%")
                    ->orWhere('website_url', 'like', "%{$search}%");
            });
        }

        // Apply skill filter
        if ($request->has('skills') && is_array($request->skills) && count($request->skills) > 0) {
            $portfoliosQuery->whereHas('skills', function ($query) use ($request) {
                $query->whereIn('name', $request->skills);
            });
        }

        // Apply tech stack filter
        if ($request->has('techStack') && is_array($request->techStack) && count($request->techStack) > 0) {
            $portfoliosQuery->whereHas('techStacks', function ($query) use ($request) {
                $query->whereIn('name', $request->techStack);
            });
        }

        // Apply profession filter
        if ($request->has('profession') && is_array($request->profession) && count($request->profession) > 0) {
            $portfoliosQuery->whereHas('professions', function ($query) use ($request) {
                $query->whereIn('name', $request->profession);
            });
        }

        $portfolios = $portfoliosQuery->latest()->get()->map(function ($user) {
            // Prioritize Google avatar, fall back to profile_picture
            $authorImage = null;
            if ($user->avatar) {
                $authorImage = "/storage/{$user->avatar}";
            } elseif ($user->profile_picture) {
                $authorImage = "/storage/{$user->profile_picture}";
            }

            return [
                'id' => $user->id,
                'title' => $user->name . "'s Portfolio",
                'author' => $user->name,
                'authorImage' => $authorImage,
                'image' => $user->portfolio_desktop_image ? "/storage/{$user->portfolio_desktop_image}" : null,
                'mobileImage' => $user->portfolio_mobile_image ? "/storage/{$user->portfolio_mobile_image}" : null,
                'description' => $user->portfolio_description ?? 'No description provided.',
                'websiteUrl' => $user->website_url,
                'skills' => $user->skills->pluck('name')->toArray(),
                'techStack' => $user->techStacks->pluck('name')->toArray(),
                'profession' => $user->professions->pluck('name')->toArray(),
                'created_at' => $user->created_at,
                'is_featured' => $user->is_featured ?? false,
                'featured_at' => $user->featured_at,
            ];
        });

        return Inertia::render('observatory', [
            'filterOptions' => [
                'skills' => Skill::where('category', 'skills')
                    ->orderBy('name')
                    ->pluck('name')
                    ->toArray(),
                'techStack' => TechStack::orderBy('name')
                    ->pluck('name')
                    ->toArray(),
                'profession' => Profession::orderBy('name')
                    ->pluck('name')
                    ->toArray(),
            ],
            'portfolios' => $portfolios,
        ]);
    }
}
