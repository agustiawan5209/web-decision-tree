/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import DecisionTreeModel from '@/services/decision-tree-model';
import { KriteriaTypes, LabelTypes } from '@/types';
import { Loader2, LoaderCircle, SquareCheck } from 'lucide-react';
import React, { FormEventHandler, useCallback, useEffect, useState } from 'react';
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
                console.error(error);
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
                    setData({ ...data, jenis_kelamin: 'Laki-laki' });
                    return 0;
                } else if (lowerItem === 'perempuan') {
                    setData({ ...data, jenis_kelamin: 'Perempuan' });
                    return 1;
                } else if (!isNaN(parseFloat(nilai)) && isFinite(nilai)) {
                    return parseFloat(nilai); // ubah ke angka
                } else {
                    return nilai; // biarkan tetap string
                }
            });

            const result = await model.predict([feature ?? []]); // Contoh fitur
            // console.log(data, result);
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
    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={5000}
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
                                            onValueChange={(value) => handleSelectChange(index.toString(), value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['laki-laki', 'perempuan'].map((gender, idx) => (
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
                                disabled={loading || !model}
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
                    <DialogContent>
                        <DialogTitle>
                            <div className="flex items-center justify-start gap-2">
                                <SquareCheck className="size-5 bg-green-500 text-white" /> <span>Hasil Klasifikasi</span>
                            </div>
                        </DialogTitle>
                        <DialogDescription>
                            <div>
                                <div className="block list-none space-y-1">
                                    <div className="flex gap-3">
                                        <span className="font-semibold text-foreground">Nama Anak:</span>
                                        <span className="font-normal text-foreground/90">{data.nama}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-semibold text-foreground">Tanggal Lahir:</span>
                                        <span className="font-normal text-foreground/90">{data.tanggal_lahir}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-semibold text-foreground">usia:</span>
                                        <span className="font-normal text-foreground/90">{hitungUsia(data.tanggal_lahir)}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-semibold text-foreground">Status Nutrisi:</span>
                                        <span className="font-normal text-foreground/90">{prediction?.label}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="font-semibold text-foreground">Jenis Sayuran:</span>
                                        <span className="font-normal text-foreground/90">{prediction?.rekomendasi}</span>
                                    </div>
                                </div>
                            </div>
                        </DialogDescription>

                        <DialogFooter>
                            <Button type="button" variant="default" size="sm" className="flex-1" disabled={processing} onClick={submit}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </DialogFooter>

                        <DialogClose />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ClassifyPemeriksaan;
