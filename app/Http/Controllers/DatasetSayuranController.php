<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\Gejala;
use Illuminate\Http\Request;
use App\Models\DatasetSayuran;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreDatasetSayuranRequest;
use App\Http\Requests\UpdateDatasetSayuranRequest;

class DatasetSayuranController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'datasetSayuran',
            'href' => '/admin/dataset-sayuran/',
        ],
    ];

    public function getDataByStatus($status, $gejala)
    {
        $data = explode(',', $gejala);
        $query = DatasetSayuran::query();

        foreach ($data as $g) {
            $query->orWhere('gejala', 'like', '%' . trim($g) . '%');
        }

        return $query->get();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("admin/datasetSayuran/index", [
            'datasetSayuran' => DatasetSayuran::orderBy('nama_sayuran', 'asc')->paginate($request->input('per_page', 30)),
            'breadcrumb' => self::BASE_BREADCRUMB,

            'titlePage' => 'DatasetSayuran',
            'can' => [
                'add' => Auth::user()->can('add label'),
                'edit' => Auth::user()->can('edit label'),
                'read' => Auth::user()->can('read label'),
                'delete' => Auth::user()->can('delete label'),
            ],
        ]);
    }
    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('q')) {
            $query->searchByName($request->input('q'));
        }
        if ($request->filled('category')) {
            $query->searchByCategory($request->input('category'));
        }

        if (in_array($request->input('order_by'), ['asc', 'desc'])) {
            $query->orderBy('created_at', $request->input('order_by'));
        } elseif (in_array($request->input('order_by'), ['A-Z', 'Z-A'])) {
            $direction = $request->input('order_by') === 'A-Z' ? 'asc' : 'desc';
            $query->orderBy('name', $direction);
        }

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/datasetSayuran/create', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah datasetSayuran',
                    'href' => '/admin/dataset-sayuran/create',
                ]
            ]),
            'gejala' => Gejala::orderBy('nama', 'asc')->get(),
            'label' => Label::orderBy('nama', 'asc')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDatasetSayuranRequest $request): \Illuminate\Http\RedirectResponse
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => DatasetSayuran::updateOrCreate([
                'id' => $request->id,
            ], $request->validated()),
            successMessage: 'DatasetSayuran Berhasil Ditambahkan!',
            redirectRoute: 'admin.datasetSayuran.index'
        );
    }


    /**
     * Display the specified resource.
     */
    public function show(DatasetSayuran $datasetSayuran)
    {
        return Inertia::render('admin/datasetSayuran/show', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail datasetSayuran',
                    'href' => '/admin/dataset-sayuran/detail',
                ]
            ]),
            'datasetSayuran' => $datasetSayuran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DatasetSayuran $datasetSayuran)
    {
        return Inertia::render('admin/datasetSayuran/create', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit datasetSayuran',
                    'href' => '/admin/dataset-sayuran/edit',
                ]
            ]),
            'datasetSayuran' => $datasetSayuran,
            'gejala' => Gejala::orderBy('nama', 'asc')->get(),
            'label' => Label::orderBy('nama', 'asc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDatasetSayuranRequest $request, DatasetSayuran $datasetSayuran)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $datasetSayuran->update($request->validated()),
            successMessage: 'DatasetSayuran Berhasil Di Update!',
            redirectRoute: 'admin.datasetSayuran.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DatasetSayuran $datasetSayuran)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $datasetSayuran->delete(),
            successMessage: 'DatasetSayuran Berhasil Di Hapus!',
            redirectRoute: 'admin.datasetSayuran.index'
        );
    }
}
