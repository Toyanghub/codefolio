<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\TechStack;
use App\Models\Profession;
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
        $user->load(['skills', 'techStacks', 'professions']);

        return Inertia::render('settings/portfolio', [
            'portfolio_desktop_image' => $user->portfolio_desktop_image,
            'portfolio_mobile_image' => $user->portfolio_mobile_image,
            'website_url' => $user->website_url,
            'portfolio_description' => $user->portfolio_description,
            'availableSkills' => Skill::where('category', 'skills')
                ->orderBy('name')
                ->get()
                ->map(fn($skill) => [
                    'label' => $skill->name,
                    'value' => (string) $skill->id,
                ]),
            'selectedSkills' => $user->skills->pluck('id')->map(fn($id) => (string) $id)->toArray(),
            'availableTechStacks' => TechStack::all()->map(fn($tech) => [
                'label' => $tech->name,
                'value' => (string) $tech->id,
            ]),
            'selectedTechStacks' => $user->techStacks->pluck('id')->map(fn($id) => (string) $id)->toArray(),
            'availableProfessions' => Profession::all()->map(fn($profession) => [
                'label' => $profession->name,
                'value' => (string) $profession->id,
            ]),
            'selectedProfessions' => $user->professions->pluck('id')->map(fn($id) => (string) $id)->toArray(),
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
     * Update the portfolio description.
     */
    public function updateDescription(Request $request): RedirectResponse
    {
        $request->validate([
            'portfolio_description' => ['nullable', 'string', 'max:5000'],
        ]);

        $request->user()->update([
            'portfolio_description' => $request->portfolio_description,
        ]);

        return back()->with('status', 'description-updated');
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
     * Update the user's tech stacks.
     */
    public function updateTechStacks(Request $request): RedirectResponse
    {
        $request->validate([
            'tech_stacks' => ['required', 'array'],
            'tech_stacks.*' => ['exists:tech_stacks,id'],
        ]);

        $request->user()->techStacks()->sync($request->tech_stacks);

        return back()->with('status', 'tech-stacks-updated');
    }

    /**
     * Update the user's professions.
     */
    public function updateProfessions(Request $request): RedirectResponse
    {
        $request->validate([
            'professions' => ['required', 'array'],
            'professions.*' => ['exists:professions,id'],
        ]);

        $request->user()->professions()->sync($request->professions);

        // Auto-publish portfolio if all required fields are filled
        $this->autoPublishPortfolio($request->user());

        return back()->with('status', 'professions-updated');
    }

    /**
     * Auto-publish portfolio if all required fields are present.
     */
    private function autoPublishPortfolio($user): void
    {
        // Check if portfolio has minimum required content
        if ($user->portfolio_desktop_image && 
            ($user->skills()->count() > 0 || $user->techStacks()->count() > 0 || $user->professions()->count() > 0)) {
            $user->update([
                'portfolio_published' => true,
                'portfolio_setup_completed' => true,
            ]);
        }
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

    /**
     * Mark portfolio setup as completed.
     */
    public function completeSetup(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Verify minimum requirements are met
        if (!$user->portfolio_desktop_image) {
            return back()->withErrors([
                'portfolio' => 'Please upload at least a desktop portfolio image to continue.',
            ]);
        }

        if ($user->skills()->count() === 0 && 
            $user->techStacks()->count() === 0 && 
            $user->professions()->count() === 0) {
            return back()->withErrors([
                'portfolio' => 'Please select at least one skill, tech stack, or profession to continue.',
            ]);
        }

        // Mark setup as completed
        $user->update([
            'portfolio_setup_completed' => true,
            'portfolio_published' => true,
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Portfolio setup completed! Welcome to your dashboard.');
    }
}

