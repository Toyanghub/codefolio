<?php

use App\Http\Controllers\Admin\CotdController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\GitHubAuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ObservatoryController;
use App\Http\Controllers\PortfolioDetailController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\WorksController;
use App\Http\Middleware\EnsureEmailIsVerified;
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

Route::get('/contact', function () {
    return Inertia::render('contact', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('contact');

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

// Google OAuth routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// GitHub OAuth routes
Route::get('/auth/github', [GitHubAuthController::class, 'redirectToGitHub'])->name('auth.github');
Route::get('/auth/github/callback', [GitHubAuthController::class, 'handleGitHubCallback']);

// Newsletter routes
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])
    ->middleware('throttle:6,1')
    ->name('newsletter.subscribe');
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])
    ->middleware('throttle:6,1')
    ->name('newsletter.unsubscribe');

// Sitemap route
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Email OTP verification routes
Route::middleware('auth')->group(function () {
    Route::get('/verify-otp', [EmailVerificationController::class, 'show'])->name('verify-otp');
    Route::post('/verify-otp', [EmailVerificationController::class, 'verifyOtp'])->name('verify-otp.verify');
    Route::post('/verify-otp/resend', [EmailVerificationController::class, 'resendOtp'])->name('verify-otp.resend');
});

// Admin routes
Route::middleware(['auth', EnsureEmailIsVerified::class, EnsureUserIsAdmin::class])->prefix('admin')->group(function () {
    Route::get('/cotd', [CotdController::class, 'index'])->name('admin.cotd');
    Route::post('/cotd/{user}/toggle', [CotdController::class, 'toggleFeatured'])->name('admin.cotd.toggle');
    Route::delete('/cotd/{user}', [CotdController::class, 'destroy'])->name('admin.cotd.destroy');
    
    Route::get('/contacts', [ContactController::class, 'index'])->name('admin.contacts');
    Route::post('/contacts/delete', [ContactController::class, 'deleteMultiple'])->name('admin.contacts.delete');
});

require __DIR__.'/settings.php';
