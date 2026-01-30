<?php

use App\Http\Controllers\Admin\CotdController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\GitHubAuthController;
use App\Http\Controllers\ObservatoryController;
use App\Http\Controllers\PortfolioDetailController;
use App\Http\Controllers\WorksController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/observatory', [ObservatoryController::class, 'index'])->name('observatory');

Route::get('/works', [WorksController::class, 'index'])->name('works');

Route::get('/portfolio/{id}', [PortfolioDetailController::class, 'show'])->name('portfolio.detail');

Route::get('/privacy-policy', function () {
    return Inertia::render('privacy-policy');
})->name('privacy.policy');

Route::get('/terms-of-service', function () {
    return Inertia::render('terms-of-service');
})->name('terms.of.service');

// Google OAuth routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// GitHub OAuth routes
Route::get('/auth/github', [GitHubAuthController::class, 'redirectToGitHub'])->name('auth.github');
Route::get('/auth/github/callback', [GitHubAuthController::class, 'handleGitHubCallback']);

// Admin routes
Route::middleware(['auth', EnsureUserIsAdmin::class])->prefix('admin')->group(function () {
    Route::get('/cotd', [CotdController::class, 'index'])->name('admin.cotd');
    Route::post('/cotd/{user}/toggle', [CotdController::class, 'toggleFeatured'])->name('admin.cotd.toggle');
    Route::delete('/cotd/{user}', [CotdController::class, 'destroy'])->name('admin.cotd.destroy');
});

require __DIR__.'/settings.php';
