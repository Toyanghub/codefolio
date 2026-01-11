<?php

use App\Http\Controllers\ObservatoryController;
use App\Http\Controllers\PortfolioDetailController;
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

require __DIR__.'/settings.php';
