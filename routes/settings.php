<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\PortfolioController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('settings/profile/picture', [ProfileController::class, 'updateProfilePicture'])->name('profile.picture.update');
    Route::delete('settings/profile/picture', [ProfileController::class, 'deleteProfilePicture'])->name('profile.picture.delete');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/portfolio', [PortfolioController::class, 'edit'])->name('portfolio.edit');
    Route::post('settings/portfolio/complete', [PortfolioController::class, 'completeSetup'])->name('portfolio.complete');
    Route::post('settings/portfolio/generate-screenshots', [PortfolioController::class, 'generateScreenshots'])->name('portfolio.screenshots.generate');
    Route::post('settings/portfolio/desktop-image', [PortfolioController::class, 'updateDesktopImage'])->name('portfolio.desktop-image.update');
    Route::post('settings/portfolio/mobile-image', [PortfolioController::class, 'updateMobileImage'])->name('portfolio.mobile-image.update');
    Route::delete('settings/portfolio/desktop-image', [PortfolioController::class, 'deleteDesktopImage'])->name('portfolio.desktop-image.delete');
    Route::delete('settings/portfolio/mobile-image', [PortfolioController::class, 'deleteMobileImage'])->name('portfolio.mobile-image.delete');
    Route::patch('settings/portfolio/website-url', [PortfolioController::class, 'updateWebsiteUrl'])->name('portfolio.website-url.update');
    Route::patch('settings/portfolio/description', [PortfolioController::class, 'updateDescription'])->name('portfolio.description.update');
    Route::patch('settings/portfolio/skills', [PortfolioController::class, 'updateSkills'])->name('portfolio.skills.update');
    Route::patch('settings/portfolio/tech-stacks', [PortfolioController::class, 'updateTechStacks'])->name('portfolio.tech-stacks.update');
    Route::patch('settings/portfolio/professions', [PortfolioController::class, 'updateProfessions'])->name('portfolio.professions.update');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
