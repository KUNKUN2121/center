<?php

use App\Http\Controllers\CreateShiftsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestShiftsController;
use App\Http\Controllers\ShiftController;
use App\Models\CreateShifts;
use App\Models\RequestShifts;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/shift', [ShiftController::class, 'index'])->name('shift.index');
    Route::get('/shift/request', [RequestShiftsController::class, 'index'])->name('shift.index');
    Route::post('/request', [RequestShiftsController::class, 'store']);
    Route::delete('/request', [RequestShiftsController::class, 'destroy']);


    // シフトクリエイター
    Route::get('/shift/create', [CreateShiftsController::class, 'index'])->name('shift.create');
    Route::post('/create', [CreateShiftsController::class, 'create']);
});

require __DIR__.'/auth.php';
