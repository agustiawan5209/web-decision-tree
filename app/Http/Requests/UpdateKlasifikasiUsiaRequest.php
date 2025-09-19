<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKlasifikasiUsiaRequest extends FormRequest
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
            'id' => 'required|exists:klasifikasi_usias,id,' . $this->klasifikasiUsia->id,
            'min_usia' => 'required|integer',
            'max_usia' => 'required|integer',
            'sayuran' => 'required|string',
            'porsi' => 'required|string',
            'tekstur' => 'required|string',
            'frekuensi' => 'required|string',
        ];
    }
}
