/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import DecisionTreeModel from '@/services/decision-tree-model';
import { KriteriaTypes, LabelTypes } from '@/types';
import { LeafyGreen, Loader2, LoaderCircle } from 'lucide-react';
import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import InputError from './input-error';
import { Button } from './ui/button';

type Dataset = {
    orang_tua_id: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    tanggal_pemeriksaan: string;
    kriteria:
        | {
              nilai: string | null;
              kriteria_id: string;
              name: string;
          }[]
        | undefined;
    label: string;
    alasan: string;
    rekomendasi: string;
    usia_balita: string;
    detail: string[];
};

interface PredictionResult {
    prediction: number | number[] | null;
    label: string | string[] | null;
    rekomendasi: string | null;
    error: string | null;
}
interface TrainingData {
    features: number[][];
    labelsY: number[];
    featureNames: string[];
    label: LabelTypes[];
}
interface EvaluationResult {
    accuracy: number;
    confusionMatrix: number[][];
}

const ClassifyPemeriksaan = ({
    data,
    setData,
    processing,
    errors,
    kriteria,
    setResult,
    setFeature,
    submit,
}: {
    data: Dataset;
    setData: React.Dispatch<React.SetStateAction<Dataset>>;
    processing: boolean;
    errors: Dataset;
    kriteria: KriteriaTypes[];
    setResult?: (predict: PredictionResult) => void;
    setFeature?: (feature: any) => void;
    submit: () => FormEventHandler;
}) => {
    // State management
    const [loading, setLoading] = useState(false);
    const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
    const [model] = useState(new DecisionTreeModel());
    const [openDialog, setOpenDialog] = useState(false);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isError, setIsError] = useState(false);
    const today = new Date();
    const day = today.toISOString().split('T')[0];

    const [toast, setToast] = useState<{
        title: string;
        show: boolean;
        message: string;
        type: 'success' | 'default' | 'error';
    }>({
        title: '',
        show: false,
        message: '',
        type: 'success',
    });

    // Input handlers
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            const [field, indexStr] = name.split('.');
            const index = Number(indexStr);

            if (field === 'kriteria') {
                if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setData((prev) => ({
                        ...prev,
                        kriteria: prev.kriteria?.map((item, i) => (i === index ? { ...item, nilai: value } : item)),
                    }));
                }
            } else {
                setData((prev) => ({ ...prev, [name]: value }));
            }
        },
        [setData],
    );

    const handleSelectChange = useCallback(
        (name: string, value: string) => {
            const index = Number(name);

            setData((prev) => ({
                ...prev,
                kriteria: prev.kriteria?.map((item, i) => (i === index ? { ...item, nilai: value } : item)),
            }));
        },
        [setData],
    );

    // Load data saat komponen mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await model.fetchAndProcessData();
                await model.loadModel();
                setTrainingData(data as any);
            } catch (error) {
                setToast({
                    title: 'Error',
                    show: true,
                    message: `${(error as Error).message}, Lakukan training pada halaman decision Tree sebelum masuk Pemeriksaan Nutrisi Anak`,
                    type: 'error',
                });
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const feature = data.kriteria?.map((item: any) => {
                const nilai = item.nilai;
                const lowerItem = String(nilai).toLowerCase();

                if (lowerItem === 'laki-laki') {
                    return 0;
                } else if (lowerItem === 'perempuan') {
                    return 1;
                } else if (!isNaN(parseFloat(nilai)) && isFinite(nilai)) {
                    return parseFloat(nilai); // ubah ke angka
                } else {
                    return nilai; // biarkan tetap string
                }
            });

            const result = await model.predict([feature ?? []]); // Contoh fitur
            console.log(data, result);
            if (result.error) {
                setToast({
                    title: 'Hasil Prediksi',
                    show: true,
                    message: result.error as string,
                    type: 'success',
                });
            } else {
                setPrediction(result);
                if (setFeature) {
                    setFeature(data.kriteria);
                }
                if (result.label !== undefined && result.label !== null) {
                    setData({ ...data, label: result.label.toString() ?? 'tidak dikenali' });
                    setData({ ...data, rekomendasi: result.rekomendasi?.toString() ?? 'tidak dikenali' });
                    if (setResult) {
                        setResult(result);
                    }
                    handleOpenDialog();
                }
            }
        } catch (error) {
            console.error(error);
            setToast({
                title: 'Hasil Prediksi',
                show: true,
                message: error as string,
                type: 'success',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Handle Input data anak
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    const minDate = tahunLalu.toISOString().split('T')[0];

    function hitungUsia(tanggalLahir: string) {
        const birthDate = new Date(tanggalLahir);
        const today = new Date();

        let tahun = today.getFullYear() - birthDate.getFullYear();
        let bulan = today.getMonth() - birthDate.getMonth();
        let hari = today.getDate() - birthDate.getDate();

        if (hari < 0) {
            bulan--;
            hari += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // total hari bulan sebelumnya
        }

        if (bulan < 0) {
            tahun--;
            bulan += 12;
        }

        return `${tahun} tahun, ${bulan} bulan, ${hari} hari`;
    }
    const predictionColor = useMemo(() => {
        if (!prediction) return '';
        switch (prediction.label) {
            case 'Buruk':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'Cukup':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'Baik':
                return 'bg-green-100 border-green-300 text-green-800';
            default:
                return 'bg-blue-100 border-blue-300 text-blue-800';
        }
    }, [prediction]);
    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={10000}
                variant={toast.type}
            />

            <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="p-6 ring-1 md:p-8">
                    <form onSubmit={(e) => handlePredict(e)} className="space-y-6">
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Balita/Anak</Label>
                                <Input
                                    id="nama"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="nama"
                                    value={data.nama}
                                    onChange={(e) => setData({ ...data, nama: e.target.value })}
                                    disabled={processing}
                                    placeholder="Nama Balita/Anak"
                                />
                                <InputError message={errors.nama} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="col-span-1 grid gap-2">
                                    <Label htmlFor="tempat_lahir">Tempat</Label>
                                    <Input
                                        id="tempat_lahir"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="tempat_lahir"
                                        value={data.tempat_lahir}
                                        onChange={(e) => setData({ ...data, tempat_lahir: e.target.value })}
                                        disabled={processing}
                                        placeholder="tempat_lahir......."
                                    />
                                    <InputError message={errors.tempat_lahir} />
                                </div>
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        required
                                        max={minDate}
                                        tabIndex={2}
                                        autoComplete="tanggal_lahir"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData({ ...data, tanggal_lahir: e.target.value })}
                                        disabled={processing}
                                        placeholder="tanggal lahir......."
                                    />
                                    <InputError message={errors.tanggal_lahir} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {kriteria.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        {item.nama.charAt(0).toUpperCase() + item.nama.slice(1)}
                                    </Label>
                                    {item.nama.toLowerCase() === 'jenis kelamin' ? (
                                        <Select
                                            value={data.kriteria?.[index].nilai || ''}
                                            required
                                            onValueChange={(value) => {
                                                setData({ ...data, jenis_kelamin: value });
                                                handleSelectChange(index.toString(), value);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Jenis Kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Laki-laki', 'Perempuan'].map((gender, idx) => (
                                                    <SelectItem key={idx} value={gender}>
                                                        {gender}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type="text"
                                            name={`kriteria.${index}`}
                                            value={data.kriteria?.[index].nilai || ''}
                                            onChange={handleChange}
                                            placeholder={`Enter ${item.nama}`}
                                            disabled={processing}
                                            required
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading || !model || isError}
                                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Mulai Klasifikasi
                            </Button>
                        </div>
                    </form>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger />
                    <DialogContent className="max-w-md">
                        <DialogTitle>
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                                    <LeafyGreen className={`h-4 w-4 ${prediction?.label == 'Baik' ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                                <span className="text-lg font-medium">Hasil Klasifikasi</span>
                            </div>
                        </DialogTitle>

                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Nama Anak</p>
                                    <p className="text-sm font-medium">{data.nama}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Tanggal Lahir</p>
                                    <p className="text-sm font-medium">{data.tanggal_lahir}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Usia</p>
                                    <p className="text-sm font-medium">{hitungUsia(data.tanggal_lahir)}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className={'text-sm font-medium text-muted-foreground ' + predictionColor}>Status Nutrisi</p>
                                    <p
                                        className={`h-auto w-max flex-shrink-0 rounded-full px-2 ${
                                            prediction?.label === 'Buruk'
                                                ? 'bg-red-500'
                                                : prediction?.label === 'Cukup'
                                                  ? 'bg-yellow-500'
                                                  : prediction?.label === 'Baik'
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-500'
                                        }`}
                                    >
                                        {prediction?.label}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Jenis Sayuran</p>
                                <p className="text-sm font-medium">{prediction?.rekomendasi}</p>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="default" size="sm" className="w-full" disabled={processing} onClick={submit}>
                                {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ClassifyPemeriksaan;
