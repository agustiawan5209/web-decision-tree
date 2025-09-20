<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatasetSayuran extends Model
{
    /** @use HasFactory<\Database\Factories\DatasetSayuranFactory> */
    use HasFactory;

    protected $fillable = [
        'nama_sayuran',
        'manfaat',
        'nutrisi',
        'status',
        'gejala',
        'porsi',
        'porsi_hari',
        'penyajian',
    ];
}
