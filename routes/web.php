<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DatasetController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\JenisTanamanController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\DecisionTreeController;
use App\Http\Controllers\RiwayatKlasifikasiController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:admin|super_admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');



    Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {

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
                Route::get('/{riwayat}/show', 'show')->name('show');
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


require __DIR__ . '/guest.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::post('/decision-tree/store', [DecisionTreeController::class, 'store'])->name('DecisionTree.store');
Route::get('/decision-tree/get-model', [DecisionTreeController::class, 'getModel'])->name('DecisionTree.getModel');
