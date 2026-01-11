<?php

use App\Http\Controllers\Admin\CotdController;
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

// Admin routes
Route::middleware(['auth', EnsureUserIsAdmin::class])->prefix('admin')->group(function () {
    Route::get('/cotd', [CotdController::class, 'index'])->name('admin.cotd');
    Route::post('/cotd/{user}/toggle', [CotdController::class, 'toggleFeatured'])->name('admin.cotd.toggle');
});

require __DIR__.'/settings.php';
