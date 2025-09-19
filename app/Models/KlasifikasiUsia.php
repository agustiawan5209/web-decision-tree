<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KlasifikasiUsia extends Model
{
    /** @use HasFactory<\Database\Factories\KlasifikasiUsiaFactory> */
    use HasFactory;

    protected $fillable = [
        'min_usia',
        'max_usia',
        'sayuran',
        'porsi',
        'tekstur',
        'frekuensi',
    ];
}
