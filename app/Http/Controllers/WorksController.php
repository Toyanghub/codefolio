<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\TechStack;
use App\Models\Profession;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorksController extends Controller
{
    /**
     * Display the works page with featured portfolios.
     */
    public function index(Request $request): Response
    {
        // Get featured portfolios query
        $featuredPortfoliosQuery = User::query()
            ->where('is_featured', true)
            ->whereNotNull('portfolio_desktop_image')
            ->where('portfolio_published', true)
            ->with(['skills', 'techStacks', 'professions']);

        // Apply skill filter
        if ($request->has('skills') && is_array($request->skills) && count($request->skills) > 0) {
            $featuredPortfoliosQuery->whereHas('skills', function ($query) use ($request) {
                $query->whereIn('name', $request->skills);
            });
        }

        // Apply tech stack filter
        if ($request->has('techStack') && is_array($request->techStack) && count($request->techStack) > 0) {
            $featuredPortfoliosQuery->whereHas('techStacks', function ($query) use ($request) {
                $query->whereIn('name', $request->techStack);
            });
        }

        // Apply profession filter
        if ($request->has('profession') && is_array($request->profession) && count($request->profession) > 0) {
            $featuredPortfoliosQuery->whereHas('professions', function ($query) use ($request) {
                $query->whereIn('name', $request->profession);
            });
        }

        $featuredPortfolios = $featuredPortfoliosQuery
            ->orderByDesc('featured_at')
            ->get()
            ->map(function ($user) {
                // Prioritize Google avatar, fall back to profile_picture
                $avatar = null;
                if ($user->avatar) {
                    $avatar = asset('storage/' . $user->avatar);
                } elseif ($user->profile_picture) {
                    $avatar = asset('storage/' . $user->profile_picture);
                } else {
                    $avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed={$user->name}";
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->professions->first()?->name ?? 'Developer',
                    'avatar' => $avatar,
                    'image' => $user->portfolio_desktop_image 
                        ? asset('storage/' . $user->portfolio_desktop_image)
                        : null,
                    'skills' => $user->skills->pluck('name')->toArray(),
                    'techStack' => $user->techStacks->pluck('name')->toArray(),
                    'description' => $user->portfolio_description ?? '',
                    'profession' => $user->professions->pluck('name')->toArray(),
                ];
            });

        return Inertia::render('works', [
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
            'cotdPortfolios' => $featuredPortfolios,
        ]);
    }
}
