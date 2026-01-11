<?php

use App\Http\Controllers\ObservatoryController;
use App\Http\Controllers\PortfolioDetailController;
use App\Http\Middleware\EnsureProfileIsComplete;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/observatory', [ObservatoryController::class, 'index'])->name('observatory');

Route::get('/works', function () {
    return Inertia::render('works');
})->name('works');

Route::get('/portfolio/{id}', [PortfolioDetailController::class, 'show'])->name('portfolio.detail');

// Dashboard route with profile completion check
Route::middleware(['auth', EnsureProfileIsComplete::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
