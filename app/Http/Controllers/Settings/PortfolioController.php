<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
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
        return Inertia::render('settings/portfolio', [
            'portfolio_desktop_image' => $request->user()->portfolio_desktop_image,
            'portfolio_mobile_image' => $request->user()->portfolio_mobile_image,
        ]);
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

