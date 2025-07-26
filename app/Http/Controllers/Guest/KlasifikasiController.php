<?php

namespace App\Http\Controllers\Guest;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\Dataset;
use App\Models\Kriteria;
use App\Models\JenisTanaman;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class KlasifikasiController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'decision-tree',
            'href' => '/admin/decision-tree/',
        ],
    ];

    public function index(Request $request)
    {
        // Handle the request to display the Decision Tree model index page
        // dd($this->getData());
        return Inertia::render('guest/klasifikasi', [
            'dataTraining' => $this->getData(),
            "kriteria" => Kriteria::all(),
            "jenisTanaman" => JenisTanaman::all(),
            "opsiLabel" => Label::all(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'DecisionTree',
            'can' => [
                'add' => true,
                'edit' => true,
                'show' => true,
                'delete' => true,
            ]
        ]);
    }

    private function getData()
    {
        // Logic to retrieve data for the Decision Tree model

        $data = [];
        $dataset = Dataset::with(['detail', 'detail.kriteria'])->orderBy('id', 'desc')->get();
        $kriteria = Kriteria::select('nama')->orderBy('id', 'asc')->get()->pluck('nama')->toArray();
        $gejala = ["daun menguning" => 1, "pertumbuhan lambat" => 2, "ujung daun mengering" => 3, "daun sehat" => 4, "batang rapuh" => 5, "daun menggulung" => 6];
        foreach ($dataset as $row) {
            $attribut = [];
            foreach ($row->detail as $key => $detail) {
               $attribut[$detail->kriteria->nama] = floatval($detail->nilai);
            }
            $data[] = array_merge($attribut, [
                $row->jenis_kelamin,
                $row->label,
            ]);
        }
        // dd($data);
        return [
            'training' => array_values($data),
            'kriteria' => array_merge($kriteria, ["jenis_kelamin", 'label']),
        ];
    }
}
