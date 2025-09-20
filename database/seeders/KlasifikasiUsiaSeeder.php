<?php

namespace Database\Seeders;

use App\Models\KlasifikasiUsia;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KlasifikasiUsiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $klasifikasi_usias = array(
            array('id' => '1', 'min_usia' => '1', 'max_usia' => '2', 'sayuran' => 'Wortel, Labu Kuning, Bayam', 'porsi' => '40 - 50 gram', 'tekstur' => 'Dilumatkan (puree), sup, kukus hingga sangat lunak', 'frekuensi' => '2 - 3 kali', 'created_at' => '2025-09-20 16:06:53', 'updated_at' => '2025-09-20 16:06:53'),
            array('id' => '2', 'min_usia' => '1', 'max_usia' => '2', 'sayuran' => 'Brokoli', 'porsi' => '40 - 50 gram', 'tekstur' => 'Kukus hingga lunak, dicincang halus', 'frekuensi' => '2 - 3 kali', 'created_at' => '2025-09-20 16:07:19', 'updated_at' => '2025-09-20 16:07:19'),
            array('id' => '3', 'min_usia' => '3', 'max_usia' => '4', 'sayuran' => 'Kacang Panjang, Buncis', 'porsi' => '50 - 75 gram', 'tekstur' => 'Direbus/ dikukus, dipotong kecil - kecil', 'frekuensi' => '2 - 3 kali', 'created_at' => '2025-09-20 16:07:43', 'updated_at' => '2025-09-20 16:07:43'),
            array('id' => '4', 'min_usia' => '3', 'max_usia' => '4', 'sayuran' => 'Jagung Muda, Kembang Kol', 'porsi' => '50 - 75 gram', 'tekstur' => 'Ditumis, direbus, dipotong kecil', 'frekuensi' => '2 - 3 kali', 'created_at' => '2025-09-20 16:08:03', 'updated_at' => '2025-09-20 16:08:03'),
            array('id' => '5', 'min_usia' => '5', 'max_usia' => '6', 'sayuran' => 'Hampir semua jenis sayuran', 'porsi' => '75 -100 gram', 'tekstur' => 'Direbus, dikukus, ditumis, dipanggang (potongan lebih besar)', 'frekuensi' => '2 - 3 kali', 'created_at' => '2025-09-20 16:08:29', 'updated_at' => '2025-09-20 16:08:29')
        );

        KlasifikasiUsia::insert($klasifikasi_usias);
    }
}
