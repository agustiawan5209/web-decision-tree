import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import { JenisTanamanTypes, KriteriaTypes, LabelTypes, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { RandomForestClassifier } from 'ml-random-forest';
import React, { useEffect, useState } from 'react';

interface FormData {
    feature1: string;
    feature2: string;
    feature3: string;
    // Add more features as needed
}

const initialFormData: FormData = {
    feature1: '',
    feature2: '',
    feature3: '',
};

const opsiGejala = [
    { label: 'daun menguning', value: 0 },
    { label: 'pertumbuhan lambat', value: 1 },
    { label: 'ujung daun mengering', value: 2 },
    { label: 'daun sehat', value: 3 },
    { label: 'batang rapuh', value: 4 },
    { label: 'daun menggulung', value: 5 },
];
type Dataset = {
    jenis_tanaman: string;
    label: string;
    attribut: string[];
};

const FormClassifier = ({
    kriteria,
    jenisTanaman,
    opsiLabel,
}: {
    kriteria: KriteriaTypes[];
    jenisTanaman: JenisTanamanTypes[];
    opsiLabel: LabelTypes[];
}) => {
    const page = usePage<SharedData>().props;
    const { auth } = page;
    const findLabel = (value: number) => {
        const result = opsiLabel.find((label) => label.id === value);
        if (result) {
            return {
                predict: result.nama,
                text: result.deskripsi,
            };
        } else {
            return {
                predict: 'Tidak Ditemukan',
                text: 'Tidak Ditemukan',
            };
        }
    };
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [result, setResult] = useState<{ predict: string; text: string }>({
        predict: '',
        text: '',
    });
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState<RandomForestClassifier | null>(null);
    const { data, setData, post, processing, errors } = useForm<Dataset>({
        jenis_tanaman: '',
        label: '',
        attribut: kriteria.map((_, index) => ''),
    });
    const [toast, setToast] = useState<{ title: string; show: boolean; message: string; type: 'success' | 'default' | 'error' }>({
        title: '',
        show: false,
        message: '',
        type: 'success',
    });
    const getModel = async () => {
        try {
            const response = await axios.get('/random-forest/get-model');

            // Pastikan response memiliki struktur yang diharapkan
            if (!response.data?.model) {
                throw new Error('Invalid model response structure');
            }

            // Rekonstruksi model dari data serialisasi
            const modelData = response.data.model;
            const classifier = RandomForestClassifier.load(modelData);

            setModel(classifier);
            return classifier; // Mengembalikan model untuk penggunaan lanjutan
        } catch (error) {
            console.error('Failed to load model:', error);
            setToast({
                title: 'Error',
                show: true,
                message: 'Gagal memuat model',
                type: 'error',
            });
            // Tambahkan penanganan error ke user (misal: toast notification)
            throw error; // Re-throw untuk penanganan di komponen pemanggil
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getModel();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const key = name.split('.')[1];
        setData((prevData) => ({
            ...prevData,
            attribut: prevData.attribut.map((item, index) => {
                if (index === Number(key)) {
                    return value;
                } else {
                    return item;
                }
            }),
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && data && data.attribut) {
            if (name === 'label' || name === 'jenis_tanaman') {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    attribut: prevData.attribut.map((item, index) => {
                        if (index === Number(name)) {
                            return value;
                        } else {
                            return item;
                        }
                    }),
                }));
            }
        } else {
            console.error('Invalid data: name, value, or attribut may be undefined');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult({ predict: '', text: '' });
        try {
            const attribut = data.attribut.map((item) => {
                const found = opsiGejala.find((gejala) => gejala.label === item);
                return found ? found.value : Number(item);
            });
            const tanaman = jenisTanaman.find((item) => item.nama === data.jenis_tanaman);
            attribut.push(tanaman?.id || 0);
            const options = {
                seed: 42,
                maxFeatures: 2,
                replacement: true,
                nEstimators: 100,
                // maxDepth: 5, // Tambahkan pembatasan kedalaman
                useSampleBagging: true,
            };

            if (model) {
                const classifier = model.predict([attribut]);

                const { predict, text } = findLabel(classifier[0]);
                setResult({
                    predict: predict,
                    text: text,
                });
                if (auth.role !== 'admin') {
                    const response = await axios.post(route('riwayat-klasifikasi.store'), {
                        user: auth.user,
                        jenis_tanaman: data.jenis_tanaman,
                        label: predict,
                        attribut: data.attribut,
                        kriteria: kriteria.map((item) => item.nama),
                    });
                }
            }
            // const predict = model?.predict();
            // Replace with your API endpoint for classification
        } catch (error) {
            setResult({
                predict: 'Tidak Ditemukan',
                text: 'Tidak Ditemukan',
            });
            setToast({
                title: 'Error',
                show: true,
                message: 'Gagal memuat hasil klasifikasi',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={5000}
                variant={toast.type}
            />
            <h2 className="mb-4 text-2xl font-bold">Random Forest Classification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label className="text-xs text-gray-600">Jenis Tanaman</Label>
                        <Select value={data.jenis_tanaman} required onValueChange={(value) => handleSelectChange('jenis_tanaman', value)}>
                            <SelectTrigger className="input-minimal">
                                <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                {jenisTanaman.map((item: any, index) => (
                                    <SelectItem key={index} value={item.nama}>
                                        {item.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.jenis_tanaman && <InputError message={errors.jenis_tanaman} className="mt-2" />}
                    </div>
                    {kriteria.map((item: any, index: number) => {
                        if (item.nama === 'gejala') {
                            return (
                                <div key={index}>
                                    <Label htmlFor={`attribut.${index}`} className="text-xs text-gray-600">
                                        {item.nama}
                                    </Label>
                                    <Select
                                        value={data.attribut[index] || ''}
                                        required
                                        onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                    >
                                        <SelectTrigger className="input-minimal">
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opsiGejala.map((gejala: any, index) => (
                                                <SelectItem key={index} value={gejala.label}>
                                                    {gejala.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            );
                        }
                        return (
                            <div key={index}>
                                <Label className="text-xs text-gray-600">{item.nama}</Label>
                                <Input
                                    type="text"
                                    name={`attribut.${index}`}
                                    value={data.attribut[index] || ''}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    placeholder={`masukkan ${item.nama}`}
                                    required
                                />
                            </div>
                        );
                    })}
                </div>
                {/* Add more feature inputs as needed */}
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:bg-blue-300" disabled={loading}>
                    {loading ? 'running...' : 'Mulai Klasifikasi'}
                </button>
            </form>
            {result && (
                <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
                    <div className="mt-2 flex flex-col items-start justify-center">
                        <div className="flex items-center">
                            <div
                                className={`mr-3 h-3 w-3 rounded-full ${
                                    result.predict === 'Buruk'
                                        ? 'bg-red-400'
                                        : result.predict === 'Cukup'
                                          ? 'bg-yellow-400'
                                          : result.predict === 'Baik'
                                            ? 'bg-green-400'
                                            : 'bg-blue-400'
                                }`}
                            />
                            <span className="text-gray-600">Hasil Klasifikasi Nutrisi Tanaman: {result.predict}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">{result.text}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormClassifier;
