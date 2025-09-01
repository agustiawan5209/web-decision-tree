<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDatasetSayuranRequest extends FormRequest
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
            'nama_sayuran' => 'required|string|max:255',
            'manfaat' => 'nullable|string',
            'nutrisi' => 'nullable|string',
            'status' => 'required|string',
            'gejala' => 'required|string',
        ];
    }
}
