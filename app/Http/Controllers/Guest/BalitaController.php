<?php

namespace App\Http\Controllers\Guest;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Balita;
use App\Models\Kriteria;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBalitaRequest;
use App\Http\Requests\UpdateBalitaRequest;
use Illuminate\Support\Facades\Auth;

class BalitaController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $balita = Balita::where('orang_tua_id', '=', Auth::user()->id)->latest()->first();
        return Inertia::render('guest/biodata');
    }

    public function store(Request $request)
    {
        $id = $request->id;
        $request->validate([
            "nik" => "required|string|max:16|unique:balitas,nik",
            "nama" => "required|string|max:100",
            "tempat_lahir" => "required|string|max:100",
            "tanggal_lahir" => "required|date",
            "jenis_kelamin" => "required|string|in:Laki-laki,Perempuan",
        ]);
        $balita = Balita::updateOrCreate([
            'id' => $id,
        ], [
            'nik' => $request->nik,
            'nama' => $request->nama,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
            'orang_tua_id' => Auth::user()->id,
        ]);

        return redirect()->route('guest.biodata.index')->with('success', 'Balita berhasil ditambahkan!!');
    }
}
