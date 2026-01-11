<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorksController extends Controller
{
    /**
     * Display the works page with featured portfolios.
     */
    public function index(): Response
    {
        // Get featured portfolios
        $featuredPortfolios = User::query()
            ->where('is_featured', true)
            ->whereNotNull('portfolio_desktop_image')
            ->where('portfolio_published', true)
            ->with(['skills', 'techStacks', 'professions'])
            ->orderByDesc('featured_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->professions->first()?->name ?? 'Developer',
                    'avatar' => $user->profile_picture ?? "https://api.dicebear.com/7.x/avataaars/svg?seed={$user->name}",
                    'image' => $user->portfolio_desktop_image 
                        ? asset('storage/' . $user->portfolio_desktop_image)
                        : null,
                    'skills' => $user->skills->pluck('name')->toArray(),
                    'techStack' => $user->techStacks->pluck('name')->toArray(),
                    'description' => $user->portfolio_description ?? '',
                ];
            });

        return Inertia::render('works', [
            'cotdPortfolios' => $featuredPortfolios,
        ]);
    }
}
