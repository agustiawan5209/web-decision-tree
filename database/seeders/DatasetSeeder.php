<?php

namespace Database\Seeders;

use App\Models\Dataset;
use App\Models\DetailDataset;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatasetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenis_tanaman = ["Kangkung", "Selada", "Seledri", "Bayam", "Pakcoy"];
        $label = ["Buruk", "Cukup", "Baik", "Sangat Baik"];
        $gejala = [
            "Buruk" => ["daun menguning", "pertumbuhan lambat", "ujung daun mengering", "batang rapuh"],
            "Cukup" => ["daun menguning", "pertumbuhan lambat", "daun menggulung"],
            "Baik" => ["daun sehat", "daun menggulung"],
            "Sangat Baik" => ["daun sehat"]
        ];

        // Aturan nilai berdasarkan label
        $range = [
            "Buruk" => [
            1 => [20, 23],    // kriteria_id 1
            2 => [600, 650],  // kriteria_id 2
            3 => [20, 28],    // kriteria_id 3
            5 => [30, 35],    // kriteria_id 5
            6 => [11, 15],    // kriteria_id 6
            ],
            "Cukup" => [
            1 => [24, 25],
            2 => [651, 700],
            3 => [29, 35],
            5 => [36, 40],
            6 => [16, 20],
            ],
            "Baik" => [
            1 => [26, 28],
            2 => [701, 800],
            3 => [36, 45],
            5 => [41, 45],
            6 => [21, 25],
            ],
            "Sangat Baik" => [
            1 => [29, 30],
            2 => [801, 900],
            3 => [46, 50],
            5 => [46, 50],
            6 => [26, 30],
            ],
        ];

        for ($i = 0; $i < 100; $i++) {
            $selected_label = fake()->randomElement($label);

            $attribut = [
            ["kriteria_id" => 1, "nilai" => fake()->numberBetween($range[$selected_label][1][0], $range[$selected_label][1][1])],
            ["kriteria_id" => 2, "nilai" => fake()->numberBetween($range[$selected_label][2][0], $range[$selected_label][2][1])],
            ["kriteria_id" => 3, "nilai" => fake()->numberBetween($range[$selected_label][3][0], $range[$selected_label][3][1])],
            ["kriteria_id" => 4, "nilai" => fake()->randomElement($gejala[$selected_label])],
            ["kriteria_id" => 5, "nilai" => fake()->numberBetween($range[$selected_label][5][0], $range[$selected_label][5][1])],
            ["kriteria_id" => 6, "nilai" => fake()->numberBetween($range[$selected_label][6][0], $range[$selected_label][6][1])],
            ];

            $data = Dataset::create([
            'data' => json_encode($attribut),
            'jenis_tanaman' => fake()->randomElement($jenis_tanaman),
            'label' => $selected_label,
            ]);

            foreach ($attribut as $value) {
            DetailDataset::create([
                'dataset_id' => $data->id,
                'kriteria_id' => $value['kriteria_id'],
                'nilai' => $value['nilai'],
            ]);
            }
        }
    }
}
