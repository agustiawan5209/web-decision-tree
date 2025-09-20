<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Label;
use Illuminate\Http\Request;
use App\Models\KlasifikasiUsia;
use Illuminate\Support\Facades\App;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreKlasifikasiUsiaRequest;
use App\Http\Requests\UpdateKlasifikasiUsiaRequest;

class KlasifikasiUsiaController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'klasifikasiUsia',
            'href' => '/admin/klasifikasiUsia/',
        ],
    ];

    public function getUsiaKlasifikasi($usia)
    {
        $klasifikasiUsia = KlasifikasiUsia::where('min_usia', '<=', $usia)
            ->where('max_usia', '>=', $usia)
            ->get();
        if ($klasifikasiUsia->count() > 0) {
            return $klasifikasiUsia;
        } else {
            return KlasifikasiUsia::orderBy('max_usia', 'desc')->latest()->first();
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("admin/klasifikasi-usia/index", [
            'listKlasifikasiUsia' => KlasifikasiUsia::orderBy('id', 'desc')->get(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'Klasifikasi Usia',
            'can' => [
                'add' => Auth::user()->can('add label'),
                'edit' => Auth::user()->can('edit label'),
                'read' => Auth::user()->can('read label'),
                'delete' => Auth::user()->can('delete label'),
            ],
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/klasifikasiUsia/create', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah klasifikasiUsia',
                    'href' => '/admin/klasifikasiUsia/create',
                ]
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKlasifikasiUsiaRequest $request): \Illuminate\Http\RedirectResponse
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => KlasifikasiUsia::create($request->validated()),
            successMessage: 'klasifikasiUsia Berhasil Ditambahkan!',
            redirectRoute: 'admin.klasifikasiUsia.index'
        );
    }


    /**
     * Display the specified resource.
     */
    public function show(KlasifikasiUsia $klasifikasiUsia)
    {
        return Inertia::render('admin/klasifikasiUsia/show', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail klasifikasiUsia',
                    'href' => '/admin/klasifikasiUsia/detail',
                ]
            ]),
            'klasifikasiUsia' => $klasifikasiUsia,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KlasifikasiUsia $klasifikasiUsia)
    {
        return Inertia::render('admin/klasifikasiUsia/edit', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit klasifikasiUsia',
                    'href' => '/admin/klasifikasiUsia/edit',
                ]
            ]),
            'klasifikasiUsia' => $klasifikasiUsia
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKlasifikasiUsiaRequest $request, KlasifikasiUsia $klasifikasiUsia)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $klasifikasiUsia->update($request->validated()),
            successMessage: 'klasifikasiUsia Berhasil Di Update!',
            redirectRoute: 'admin.klasifikasiUsia.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KlasifikasiUsia $klasifikasiUsia)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $klasifikasiUsia->delete(),
            successMessage: 'klasifikasiUsia Berhasil Di Hapus!',
            redirectRoute: 'admin.klasifikasiUsia.index'
        );
    }
}
