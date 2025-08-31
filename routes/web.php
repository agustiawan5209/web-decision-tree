<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\BalitaController;
use App\Http\Controllers\DatasetController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\OrangTuaController;
use App\Http\Controllers\PemeriksaanController;
use App\Http\Controllers\DecisionTreeController;
use App\Http\Controllers\JenisTanamanController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\RiwayatKlasifikasiController;
use App\Http\Controllers\API\DatatDecisionTreeController;
use App\Http\Controllers\GejalaController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:admin|super_admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');


    Route::prefix('balita')->as('balita.')->group(function () {
        Route::controller(BalitaController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::get('/edit/{balita}', 'edit')->name('edit');
            Route::get('/show/{balita}', 'show')->name('show');

            Route::post('/store', 'store')->name('store');
            Route::put('/update/{balita}', 'update')->name('update');
            Route::delete('/destroy/{balita}', 'destroy')->name('destroy');
        });
    });
    // Routes for managing pemeriksaans
    Route::prefix('pemeriksaan')->as('pemeriksaan.')->group(function () {
        // Dataset controller
        Route::controller(PemeriksaanController::class)->group(function () {
            // Show all pemeriksaans
            Route::get('/', 'index')->name('index');
            // Create a pemeriksaan
            Route::get('/create-id', 'createById')->name('create-id');

            // Edit a pemeriksaan
            Route::get('/edit/{pemeriksaan}', 'edit')->name('edit');
            // Show a pemeriksaan
            Route::get('/show/{pemeriksaan}', 'show')->name('show');

            // Update a pemeriksaan
            Route::put('/update/{pemeriksaan}', 'update')->name('update');
            // Delete a pemeriksaan
            Route::delete('/destroy/{pemeriksaan}', 'destroy')->name('destroy');
        });
    });
    Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {

        // Routes for managing orangtuas
        Route::prefix('orangtua')->as('orangtua.')->group(function () {
            // Dataset controller
            Route::controller(OrangTuaController::class)->group(function () {
                // Show all orangtuas
                Route::get('/', 'index')->name('index');
                // Create a orangtua
                Route::get('/create', 'create')->name('create');
                // Edit a orangtua
                Route::get('/edit/{user}', 'edit')->name('edit');
                // Show a orangtua
                Route::get('/show/{user}', 'show')->name('show');

                // Store a orangtua
                Route::post('/store', 'store')->name('store');
                // Update a orangtua
                Route::put('/update/{user}', 'update')->name('update');
                // Delete a orangtua
                Route::delete('/destroy/{user}', 'destroy')->name('destroy');
            });
        });
        // Routes for label
        Route::group(['prefix' => 'label', 'as' => 'label.'], function () {
            Route::controller(LabelController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{label}/edit', 'edit')->name('edit');
                Route::put('/{label}', 'update')->name('update');
                Route::delete('/{label}', 'destroy')->name('destroy');
            });
        });
        // Routes for gejala
        Route::group(['prefix' => 'gejala', 'as' => 'gejala.'], function () {
            Route::controller(GejalaController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{gejala}/edit', 'edit')->name('edit');
                Route::put('/{gejala}', 'update')->name('update');
                Route::delete('/{gejala}', 'destroy')->name('destroy');
            });
        });


        // Routes for Kriteria
        Route::group(['prefix' => 'kriterias', 'as' => 'kriteria.'], function () {
            Route::controller(KriteriaController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{kriteria}/edit', 'edit')->name('edit');
                Route::put('/{kriteria}', 'update')->name('update');
                Route::delete('/{kriteria}', 'destroy')->name('destroy');
            });
        });

        // Route for Jenis Sayuran
        Route::group(['prefix' => 'jenis-tanaman', 'as' => 'jenisTanaman.'], function () {
            Route::controller(JenisTanamanController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{jenisTanaman}/edit', 'edit')->name('edit');
                Route::put('/{jenisTanaman}', 'update')->name('update');
                Route::delete('/{jenisTanaman}', 'destroy')->name('destroy');
            });
        });
        // Route for training dataset
        Route::group(['prefix' => 'dataset', 'as' => 'dataset.'], function () {
            Route::controller(DatasetController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{dataset}/edit', 'edit')->name('edit');
                Route::get('/{dataset}/show', 'show')->name('show');
                Route::put('/{dataset}', 'update')->name('update');
                Route::delete('/{dataset}', 'destroy')->name('destroy');
            });
        });


        Route::group(['prefix' => 'riwayat', 'as' => 'riwayat.'], function () {
            Route::controller(RiwayatKlasifikasiController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/{pemeriksaan}/show', 'show')->name('show');
            });
        });
    });
    // Route for decision tree model
    Route::group(['prefix' => 'decision-tree', 'as' => 'DecisionTree.'], function () {
        Route::controller(DecisionTreeController::class)->group(function () {
            Route::get('/', 'index')->name('index');
        });
    });
});

// Store a pemeriksaan
Route::post('/pemeriksaan/store', [PemeriksaanController::class, 'store'])->name('pemeriksaan.store')->middleware(['auth', 'verified', 'role:user|admin|super_admin']);




require __DIR__ . '/guest.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::post('/decision-tree/store', [DecisionTreeController::class, 'store'])->name('DecisionTree.store');
Route::get('/decision-tree/get-model', [DecisionTreeController::class, 'getModel'])->name('DecisionTree.getModel');
Route::get('/api/decision-tree/get-data', [DatatDecisionTreeController::class, 'getData'])->name('api.DecisionTree.getData');


// Get Jenis Sayuran Berdasarkan nama gizi
Route::get('/api/get-sayuran', [JenisTanamanController::class, 'getSayuran'])->name('api.get.sayuran');
