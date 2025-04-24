<?php

use App\Http\Controllers\ClosedDaysController;
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
    // Route::get('/shift/request', [RequestShiftsController::class, 'index'])->name('shift.index');
    Route::resource('/shift/request', RequestShiftsController::class)->only(['index', 'store', 'destroy']);
    Route::delete('/shift/request', [RequestShiftsController::class, 'destroy']);
    // Route::post('/request', [RequestShiftsController::class, 'store']);
    // Route::delete('/request', [RequestShiftsController::class, 'destroy']);


    // シフトクリエイター

    Route::prefix('shift/admin')->as('shift.admin.')->group(function () {
        Route::get('/', [CreateShiftsController::class, 'index'])->name('index');
        Route::get('/create', [CreateShiftsController::class, 'create'])->name('create');
        Route::get('/settings', [CreateShiftsController::class, 'settingsPage'])->name('settings');
        Route::post('/create', [CreateShiftsController::class, 'createApi']);
        Route::post('/create/confirm', [CreateShiftsController::class, 'confirmApi'])->name('create.confirm');
        // 休館日API
        Route::resource('/create/holiday', ClosedDaysController::class)->only(['index', 'store', 'destroy']);
        // シフト設定API
        Route::post('/api/settings', [CreateShiftsController::class, 'settingsPostApi'])->name('settingsPostApi');
        Route::get('/api/settings', [CreateShiftsController::class, 'settingsGetApi'])->name('settingsApi');

    });

});

require __DIR__.'/auth.php';
