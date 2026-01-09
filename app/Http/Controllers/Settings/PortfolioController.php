<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Show the portfolio settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('skills');

        return Inertia::render('settings/portfolio', [
            'portfolio_desktop_image' => $user->portfolio_desktop_image,
            'portfolio_mobile_image' => $user->portfolio_mobile_image,
            'website_url' => $user->website_url,
            'availableSkills' => Skill::all()->map(fn($skill) => [
                'label' => $skill->name,
                'value' => (string) $skill->id,
                'category' => $skill->category,
            ]),
            'selectedSkills' => $user->skills->pluck('id')->map(fn($id) => (string) $id)->toArray(),
        ]);
    }

    /**
     * Update the portfolio website URL.
     */
    public function updateWebsiteUrl(Request $request): RedirectResponse
    {
        $request->validate([
            'website_url' => ['required', 'url', 'max:255'],
        ]);

        $request->user()->update([
            'website_url' => $request->website_url,
        ]);

        return back()->with('status', 'website-url-updated');
    }

    /**
     * Update the user's skills.
     */
    public function updateSkills(Request $request): RedirectResponse
    {
        $request->validate([
            'skills' => ['required', 'array'],
            'skills.*' => ['exists:skills,id'],
        ]);

        $request->user()->skills()->sync($request->skills);

        return back()->with('status', 'skills-updated');
    }

    /**
     * Update the portfolio desktop image.
     */
    public function updateDesktopImage(Request $request): RedirectResponse
    {
        $request->validate([
            'desktop_image' => ['required', 'image', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Delete old image if exists
        if ($user->portfolio_desktop_image) {
            Storage::disk('public')->delete($user->portfolio_desktop_image);
        }

        // Store new image
        $path = $request->file('desktop_image')->store('portfolio', 'public');
        
        $user->update([
            'portfolio_desktop_image' => $path,
        ]);

        return back()->with('status', 'desktop-image-updated');
    }

    /**
     * Update the portfolio mobile image.
     */
    public function updateMobileImage(Request $request): RedirectResponse
    {
        $request->validate([
            'mobile_image' => ['required', 'image', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Delete old image if exists
        if ($user->portfolio_mobile_image) {
            Storage::disk('public')->delete($user->portfolio_mobile_image);
        }

        // Store new image
        $path = $request->file('mobile_image')->store('portfolio', 'public');
        
        $user->update([
            'portfolio_mobile_image' => $path,
        ]);

        return back()->with('status', 'mobile-image-updated');
    }

    /**
     * Delete the portfolio desktop image.
     */
    public function deleteDesktopImage(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->portfolio_desktop_image) {
            Storage::disk('public')->delete($user->portfolio_desktop_image);
            $user->update(['portfolio_desktop_image' => null]);
        }

        return back()->with('status', 'desktop-image-deleted');
    }

    /**
     * Delete the portfolio mobile image.
     */
    public function deleteMobileImage(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->portfolio_mobile_image) {
            Storage::disk('public')->delete($user->portfolio_mobile_image);
            $user->update(['portfolio_mobile_image' => null]);
        }

        return back()->with('status', 'mobile-image-deleted');
    }
}

