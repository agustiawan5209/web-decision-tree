<?php

namespace App\Http\Controllers\Guest;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Label;
use App\Models\Balita;
use App\Models\Kriteria;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use App\Models\DetailPemeriksaan;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;

class KlasifikasiController extends Controller
{

    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'data pemeriksaan',
            'href' => '/pemeriksaan/',
        ],
    ];


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $statusLabel = Label::pluck('nama')->toArray();
        $pemeriksaanQuery = Pemeriksaan::with([
            'balita',
            'balita.orangtua',
            'detailpemeriksaan',
            'detailpemeriksaan.kriteria',
        ]);
        $pemeriksaanQuery->where('user_id', '=', Auth::user()->id);

        // Apply filters
        $this->applyFilters($pemeriksaanQuery, $request);

        $pemeriksaan = $pemeriksaanQuery->orderBy('id', 'desc')->get();

        return Inertia::render('guest/pemeriksaan/index', [
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => self::BASE_BREADCRUMB,
            'filter' => $request->only('search', 'order_by', 'date', 'q'),
            'statusLabel' => $statusLabel,
            'kriteria' => Kriteria::orderBy('id', 'asc')->get(),
            'can' => [
                'add' => auth()->user()->can('add pemeriksaan'),
                'edit' => auth()->user()->can('edit pemeriksaan'),
                'delete' => auth()->user()->can('delete pemeriksaan'),
                'read' => auth()->user()->can('read pemeriksaan'),
            ]
        ]);
    }

    /**
     * Apply filters to the query
     */
    private function applyFilters($query, Request $request): void
    {
        $statusLabel = Label::pluck('nama')->toArray();
        if ($request->filled('q')) {
            $query->searchByBalita($request->input('q'));
        }

        if ($request->filled('date')) {
            $query->searchByTanggal(Carbon::parse($request->date));
        }

        if (in_array($request->input('order_by'), ['asc', 'desc'])) {
            $query->orderBy('created_at', $request->input('order_by'));
        } elseif (in_array($request->input('order_by'), ['A-Z', 'Z-A'])) {
            $direction = $request->input('order_by') === 'A-Z' ? 'asc' : 'desc';
            $query->orderBy('label', $direction);
        } elseif (in_array($request->input('order_by'), $statusLabel)) {
            $query->where('label', $request->input('order_by'));
        }

        $user = Auth::user();
        if ($user->hasRole('orangtua')) {
            $query->wherehas('balita', function ($query) use ($user) {
                $query->where('orang_tua_id', $user->id);
            });
        }
    }

    /**
     * Show the form for creating a new resource.
     */

    public function createById(Request $request)
    {
        $statusLabel = Label::pluck('nama')->toArray();
        return Inertia::render('guest/pemeriksaan/create-id', [
            'kriteria' => Kriteria::orderBy('id')
                ->whereNotIn('nama', ['status'])
                ->get(),
            'orangtua' => User::withoutRole(['admin', 'super_admin'])->get(),
            'balita' => Balita::orderBy('id')->where('orang_tua_id', Auth::user()->id)->with(['orangtua'])->get(),
            'balitaId' => Balita::orderBy('id')->where('orang_tua_id', Auth::user()->id)->with(['orangtua'])->first(),
            'label' => array_map(fn($label) => ['nama' => $label], $statusLabel),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah pemeriksaan',
                    'href' => '/pemeriksaan/create',
                ],
            ]),
        ]);
    }


    public function store(StorePemeriksaanRequest $request)
    {
        // Validate the request

        try {
            $balitaData = $request->except('kriteria', 'tanggal_pemeriksaan');

            $existingBalitaWithNama = Balita::where('nama', '=', $request->nama)->where('orang_tua_id', '=', $request->orang_tua_id)->first();
            if ($existingBalitaWithNama) {
                $balita = $existingBalitaWithNama;
            } else {

                $balita = Balita::create($balitaData);
            }

            $pemeriksaanData = [
                'user_id' => Auth::user()->id,
                'balita_id' => $balita->id,
                'data_balita' => $balita,
                'data_pemeriksaan' => $request->input('kriteria'),
                'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
                'label' => $request->input('label'),
                'rekomendasi' => $request->input('rekomendasi'),
            ];
            $pemeriksaan = Pemeriksaan::create($pemeriksaanData);

            $this->createDetailPemeriksaan($pemeriksaan, $request->input('kriteria'), $balita->jenis_kelamin, $request->input('label'));

            return redirect()->route('guest.klasifiksi.index')->with('success', 'Data pemeriksaan berhasil ditambahkan!');
        } catch (\Exception $exception) {
            $pemeriksaan = Pemeriksaan::latest()->first();
            if ($pemeriksaan) {
                $pemeriksaan->delete();
            }
            return redirect()
                ->route('pemeriksaan.create-id')
                ->with('error', $exception->getMessage());
        }
    }

    /**
     * Create detail pemeriksaan records
     */
    private function createDetailPemeriksaan(Pemeriksaan $pemeriksaan, array $kriteria, string $jenisKelamin, $label): void
    {
        $detailRecords = array_map(function ($item) use ($pemeriksaan) {
            return [
                'pemeriksaan_id' => $pemeriksaan->id,
                'kriteria_id' => $item['kriteria_id'],
                'nilai' => $item['nilai'],
            ];
        }, $kriteria);

        // Add jenis kelamin kriteriae if exists
        if ($jenkelKriteria = Kriteria::where('nama', 'like', '%jenis kelamin%')->first()) {
            $detailRecords[] = [
                'pemeriksaan_id' => $pemeriksaan->id,
                'kriteria_id' => $jenkelKriteria->id,
                'nilai' => $jenisKelamin,
            ];
        }
        if ($statusKriteria = Kriteria::where('nama', 'like', '%status%')->first()) {
            $detailRecords[] = [
                'pemeriksaan_id' => $pemeriksaan->id,
                'kriteria_id' => $statusKriteria->id,
                'nilai' => $label,
            ];
        }

        DetailPemeriksaan::insert($detailRecords);
    }


    /**
     * Display the specified resource.
     */
    public function show(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->load([
            'balita',
            'balita.orangtua',
            'balita.pemeriksaan',
            'balita.pemeriksaan.detailpemeriksaan',
            'detailpemeriksaan',
            'detailpemeriksaan.kriteria',
        ]);

        return Inertia::render('guest/pemeriksaan/show', [
            'pemeriksaan' => $pemeriksaan,
            'balita' => $pemeriksaan->balita,
            'orangTua' => $pemeriksaan->balita->orangtua,
            'detail' => $pemeriksaan->detailpemeriksaan,
            'dataPemeriksaanBalita' => $pemeriksaan->balita->pemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail pemeriksaan',
                    'href' => '/pemeriksaan/show',
                ],
            ]),
            'kriteria' => Kriteria::orderBy('id', 'asc')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pemeriksaan $pemeriksaan)
    {
        $statusLabel = Label::pluck('nama')->toArray();
        return Inertia::render('guest/pemeriksaan/edit', [
            'kriteria' => Kriteria::orderBy('id')->get(),
            'label' => array_map(fn($label) => ['nama' => $label], $statusLabel),
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit pemeriksaan',
                    'href' => '/pemeriksaan/edit',
                ],
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemeriksaanRequest $request, Pemeriksaan $pemeriksaan)
    {
        DB::transaction(function () use ($request, $pemeriksaan) {
            $pemeriksaan->update([
                'data_pemeriksaan' => $request->input('kriteria'),
                'tgl_pemeriksaan' => $request->input('tgl_pemeriksaan'),
                'label' => $request->input('label'),
            ]);

            DetailPemeriksaan::where('pemeriksaan_id', $pemeriksaan->id)->delete();

            $detailRecords = array_map(function ($kriteriaId, $nilai) use ($pemeriksaan) {
                return [
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'kriteria_id' => $kriteriaId,
                    'nilai' => $nilai,
                ];
            }, array_keys($request->kriteria), $request->kriteria);

            DetailPemeriksaan::insert($detailRecords);
        });

        return redirect()
            ->route('guest.klasifikasi.index')
            ->with('success', 'Data pemeriksaan berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->delete();


        return redirect()
            ->route('guest.klasifikasi.index')
            ->with('success', 'Data pemeriksaan berhasil dihapus!');
    }
}
