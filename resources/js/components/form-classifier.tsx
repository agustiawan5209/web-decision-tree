/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import DecisionTreeModel from '@/services/decision-tree-model';
import { KriteriaTypes, LabelTypes, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';

type Dataset = {
    label: string;
    attribut: string[];
};

interface PredictionResult {
    prediction: number | number[] | null;
    label: string | string[] | null;
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
const FormClassifier = ({ kriteria }: { kriteria: KriteriaTypes[] }) => {
    const { auth } = usePage<SharedData>().props;
    // State management
    const [loading, setLoading] = useState(false);
    const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
    const [model] = useState(new DecisionTreeModel());
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

    // Form handling
    const { data, setData, processing } = useForm<Dataset>({
        label: '',
        attribut: kriteria.map(() => ''),
    });

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
            const key = name.split('.')[1];

            if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                setData((prev) => ({
                    ...prev,
                    attribut: prev.attribut.map((item, index) => (index === Number(key) ? value : item)),
                }));
            }
        },
        [setData],
    );

    const handleSelectChange = useCallback(
        (name: string, value: string) => {
            if (name === 'label') {
                setData((prev) => ({ ...prev, [name]: value }));
            } else {
                setData((prev) => ({
                    ...prev,
                    attribut: prev.attribut.map((item, index) => (index === Number(name) ? value : item)),
                }));
            }
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

    const handleTrainAndEvaluate = async () => {
        setLoading(true);
        try {
            await model.trainModel();
            const evalResult = await model.evaluateModel();

            await model.saveModel();
            setEvaluationResult(evalResult);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const feature = data.attribut.map((item: any) => {
                const lowerItem = String(item).toLowerCase();

                if (lowerItem === 'laki-laki') {
                    return 0;
                } else if (lowerItem === 'perempuan') {
                    return 1;
                } else if (!isNaN(parseFloat(item)) && isFinite(item)) {
                    return parseFloat(item); // ubah ke angka
                } else {
                    return item; // biarkan tetap string
                }
            });

            const result = await model.predict([feature]); // Contoh fitur
            console.log(result);
            setPrediction(result);
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

    const dataState = model.getDataLoadingState();
    const trainingState = model.getTrainingState();
    const evalState = model.getEvaluationState();
    const predState = model.getPredictionState();
    // Determine prediction color
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
                duration={5000}
                variant={toast.type}
            />

            <div className="mb-10 text-center">
                <h1 className="mb-2 text-4xl font-bold text-gray-800">Nutrisi Klasifikasi</h1>
                <p className="mx-auto max-w-2xl text-gray-600">Klasifikasi Jenis Sayuran Berdasarkan Nutrisi untuk Anak</p>
            </div>

            <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:grid-cols-2">
                <div className="p-6 ring-1 md:p-8">
                    <form onSubmit={(e) => handlePredict(e)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {kriteria.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        {item.nama.charAt(0).toUpperCase() + item.nama.slice(1)}
                                    </Label>
                                    {item.nama.toLowerCase() === 'jenis kelamin' ? (
                                        <Select
                                            value={data.attribut[index] || ''}
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
                                            name={`attribut.${index}`}
                                            value={data.attribut[index] || ''}
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
                            {(auth.role === 'admin' || auth.role === 'super_admin') && (
                                <Button type="button" variant="outline" onClick={handleTrainAndEvaluate} disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Train Model
                                </Button>
                            )}
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

                <div className="p-6 md:p-8">
                    {evaluationResult && (
                        <div className={`border p-6 transition-all duration-300`}>
                            <div className="flex items-center">
                                <div className={`h-5 w-5 flex-shrink-0 rounded-full bg-green-500`} />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">Hasil Evaluasi Model</h3>
                                    <div className="mt-1 text-2xl font-bold">{(evaluationResult.accuracy * 100)} %</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {prediction ? (
                        <div className={`border ${predictionColor} p-6 transition-all duration-300`}>
                            <div className="flex items-center">
                                <div
                                    className={`h-5 w-5 flex-shrink-0 rounded-full ${
                                        prediction.label === 'Buruk'
                                            ? 'bg-red-500'
                                            : prediction.label === 'Cukup'
                                              ? 'bg-yellow-500'
                                              : prediction.label === 'Baik'
                                                ? 'bg-green-500'
                                                : 'bg-blue-500'
                                    }`}
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">Hasil Klasifikasi</h3>
                                    <div className="mt-1 text-2xl font-bold">{prediction.label}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-gray-200 p-6 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-gray-500" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">Hasil Klasifikasi</h3>
                                    <div className="mt-1 text-2xl font-bold">-</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormClassifier;
