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
        $label = ["Buruk","Baik"];
        $gejala = [
            "Cukup" => ["daun menguning", "pertumbuhan lambat", "daun menggulung"],
            "Baik" => ["daun sehat", "daun menggulung"],
        ];

        // Aturan nilai berdasarkan label
        $range = [
            "Buruk" => [
            1 => [20, 23],    // kriteria_id 1
            2 => [600, 650],  // kriteria_id 2
            3 => [20, 28],    // kriteria_id 3
            4 => [30, 35],    // kriteria_id 5
            5 => [30, 35],    // kriteria_id 5
            6 => [11, 15],    // kriteria_id 6
            ],
            "Baik" => [
            1 => [26, 28],
            2 => [701, 800],
            3 => [36, 45],
            4 => [41, 45],
            5 => [41, 45],
            6 => [21, 25],
            ],
        ];

        for ($i = 0; $i < 100; $i++) {
            $selected_label = fake()->randomElement($label);

            $attribut = [
            ["kriteria_id" => 1, "nilai" => fake()->randomElement(['Laki-laki', 'Perempuan'])],
            ["kriteria_id" => 2, "nilai" => fake()->numberBetween($range[$selected_label][2][0], $range[$selected_label][2][1])],
            ["kriteria_id" => 3, "nilai" => fake()->numberBetween($range[$selected_label][3][0], $range[$selected_label][3][1])],
            ["kriteria_id" => 4, "nilai" => fake()->numberBetween($range[$selected_label][4][0], $range[$selected_label][4][1])],
            ["kriteria_id" => 5, "nilai" => fake()->numberBetween($range[$selected_label][5][0], $range[$selected_label][5][1])],
            ];

            $data = Dataset::create([
            'data' => json_encode($attribut),
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
