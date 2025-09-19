<?php

namespace Database\Seeders;

use App\Models\Gejala;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GejalaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gejalas = array(
            array('id' => '1', 'nama' => 'Anemia', 'deskripsi' => 'Kulit dan bibir pucat.
Sering lemas atau mudah lelah.
Nafsu makan menurun.', 'created_at' => '2025-08-31 01:08:41', 'updated_at' => '2025-09-06 01:27:21'),
            array('id' => '2', 'nama' => 'Rambut Rontok', 'deskripsi' => 'Rambut menipis atau mudah rontok saat disisir.
Rambut tampak kusam dan rapuh.', 'created_at' => '2025-08-31 01:08:51', 'updated_at' => '2025-09-06 01:27:03'),
            array('id' => '3', 'nama' => 'Sembelit', 'deskripsi' => 'Frekuensi BAB jarang (≤2 kali/minggu).
Anak terlihat mengejan keras atau menangis saat BAB.
Feses keras atau berbentuk seperti kelereng.', 'created_at' => '2025-08-31 01:08:57', 'updated_at' => '2025-09-06 01:26:54'),
            array('id' => '4', 'nama' => 'Kulit Kering', 'deskripsi' => 'Kulit terlihat kasar, bersisik, atau pecah-pecah.
Terkadang disertai gatal atau kemerahan.
Alasan bisa diinput user: Perubahan tekstur kulit dapat diamati langsung.', 'created_at' => '2025-08-31 01:09:06', 'updated_at' => '2025-09-06 01:26:41')
        );

        Gejala::insert($gejalas);
    }
}
