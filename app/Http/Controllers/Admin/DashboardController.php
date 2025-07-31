<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\Dataset;
use App\Models\Kriteria;
use App\Models\JenisTanaman;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        // dd(Label::orderBy('id', 'desc')->get());
        $label = Label::select('nama')->orderBy('id', 'asc')->get()->pluck('nama')->toArray();

        $data = $this->getData();
        $training = collect($data['training']);
        $kriteria = $data['kriteria'];
        $distributionLabel = $this->setDistribusiLabel($training, $label);
        $meanKriteriaValue = $this->meanKriteriaValue($distributionLabel, "Sangat Baik", $kriteria);
        return Inertia::render("dashboard", [
            "distributionLabel" => $distributionLabel,
            "meanKriteriaValue" => $meanKriteriaValue,
            "label" => Label::orderBy('id', 'desc')->get(),
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
                if(strtolower($detail->kriteria->nama) == 'jenis kelamin'){
                    $attribut[$key] = strtolower($detail->nilai) == 'laki-laki' ? 0 : 1;
                }else{
               $attribut[$key] = floatval($detail->nilai);
                }
            }
            $data[] = array_merge($attribut, [
                'label' => $row->label,
            ]);
        }
        // dd($data);
        return [
            'training' => $data,
            'kriteria' => array_merge($kriteria, ['label']),
        ];
    }
    private function setDistribusiLabel($training, $label)
    {

        try {

            $distributionLabel = [];
            foreach ($label as $item) {
                $distributionLabel[$item] = [];
            }

            foreach ($training as $row) {
                $distributionLabel[$row['label']][] = $row;
            }

            return $distributionLabel;
        } catch (\Exception $e) {
            return [];
        }
    }

    private function meanKriteriaValue($training, $label, $kriteria = [])
    {
        $gejala = ["daun menguning" => 1, "pertumbuhan lambat" => 2, "ujung daun mengering" => 3, "daun sehat" => 4, "batang rapuh" => 5, "daun menggulung" => 6];
        try {
            $result = [];
            $kriterias = collect($kriteria)->diff([ 'label'])->values();

            foreach ($kriterias as $item) {
                if ($item === 'gejala') {
                    $result[$item] = array_keys(array_filter($gejala, function ($value) use ($training, $label, $item) {
                        return $value === collect($training[$label])->avg($item);
                    }))[0];
                } else {
                    $result[$item] = collect($training[$label])->avg($item);
                }
            }
            return $result;
        } catch (\Exception $e) {
            return [];
        }
    }
}
