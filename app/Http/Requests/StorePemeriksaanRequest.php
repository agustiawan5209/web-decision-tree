<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePemeriksaanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "orang_tua_id"=> "required|integer|exists:users,id",
            "rme"=> "nullable|string|max:50|unique:pemeriksaans,rme",
            "nik"=> "required|string|max:50",
            "nama"=> "required|string|max:100",
            "tempat_lahir"=> "required|string|max:100",
            "tanggal_lahir"=> "required|date",
            "jenis_kelamin"=> "required|string|in:Laki-laki,Perempuan",
            "tanggal_pemeriksaan"=> "required|date",
            "gejala"=> "required|string|max:100",
            "rekomendasi"=> "required",
            'kriteria'=> 'required|array',
            'kriteria.*.nilai'=> 'required|string',
            'kriteria.*.kriteria_id'=> 'required|exists:kriterias,id',

        ];
    }
}
