/* eslint-disable react-hooks/exhaustive-deps */
import { LabelTypes } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Interface tidak berubah
interface TrainingData {
    features: number[][];
    labelsY: number[];
    featureNames: string[];
    label: LabelTypes[];
}

// Menambahkan state untuk loading dan error agar lebih informatif di UI
interface UseDatasetReturn {
    trainingData: TrainingData | null;
    isLoading: boolean;
    error: string | null;
}

export function useDataset(): UseDatasetReturn {
    const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Buat fungsi async di dalam useEffect untuk menampung semua logika
        const fetchAndProcessData = async () => {
            // Reset state sebelum memulai
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(route('api.DecisionTree.getData'));

                if (response.status === 200) {
                    const data = response.data;

                    // Ambil data mentah dari respons API
                    const rawTraining: string[][] = data?.training ?? [];
                    const rawKriteria: string[] = data?.kriteria ?? [];
                    const labelOptions: LabelTypes[] = data?.label ?? [];

                    // Hentikan proses jika data penting tidak ada
                    if (rawTraining.length === 0 || rawKriteria.length === 0) {
                        console.warn('Data training atau kriteria dari API kosong.');
                        setTrainingData({ features: [], labelsY: [], featureNames: [], label: [] }); // Set ke state kosong yang valid
                        return;
                    }

                    // --- Proses data langsung dari variabel, bukan dari state ---
                    const features: number[][] = [];
                    const labelsY: number[] = [];

                    for (const row of rawTraining) {
                        const featureRow = row.slice(0, -1).map(Number);
                        features.push(featureRow);

                        const labelName = row[row.length - 1];
                        // Cari ID label menggunakan data label yang baru saja diambil dari API
                        const labelId = labelOptions.find((label) => label.nama === labelName)?.id || 0;
                        labelsY.push(labelId);
                    }

                    // Set state final setelah semua data berhasil diolah
                    setTrainingData({
                        features,
                        labelsY,
                        featureNames: rawKriteria.slice(0, -1),
                        label: labelOptions,
                    });
                } else {
                    throw new Error(`API mengembalikan status ${response.status}`);
                }
            } catch (err) {
                console.error('Terjadi kesalahan ketika memuat dan memproses dataset', err);
                setError('Gagal memuat dataset.');
            } finally {
                // Hentikan loading baik berhasil maupun gagal
                setIsLoading(false);
            }
        };

        fetchAndProcessData();

        // Dependency array kosong [] sudah benar, agar hook ini hanya berjalan sekali saat komponen dimuat.
    }, []);

    return { trainingData, isLoading, error };
}

interface useSplitDataTypes {
    trainFeatures: number[][];
    trainLabelsY: number[];
    testFeatures: number[][];
    testLabelsY: number[];
}

interface useSplitDataReturn {
    dataTraining: useSplitDataTypes;
    isLoading: boolean;
    error: string | null;
}
export function useSplitData(): useSplitDataReturn {
    const [dataTraining, setDataTraining] = useState<useSplitDataTypes>({
        trainFeatures: [],
        trainLabelsY: [],
        testFeatures: [],
        testLabelsY: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const splitDataTraining = (features: number[][], labelsY: number[], splitRatio = 0.7) => {
        const shuffledIndices = features.map((_, i) => i).sort(() => Math.random() - 0.5);
        const splitIndex = Math.floor(features.length * splitRatio);

        const trainFeatures = shuffledIndices.slice(0, splitIndex).map((i) => features[i]);
        const trainLabelsY = shuffledIndices.slice(0, splitIndex).map((i) => labelsY[i]);
        const testFeatures = shuffledIndices.slice(splitIndex).map((i) => features[i]);
        const testLabelsY = shuffledIndices.slice(splitIndex).map((i) => labelsY[i]);

        return { trainFeatures, trainLabelsY, testFeatures, testLabelsY };
    };

    useEffect(() => {
        // Buat fungsi async di dalam useEffect untuk menampung semua logika
        const fetchAndProcessData = async () => {
            // Reset state sebelum memulai
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(route('api.DecisionTree.getData'));

                if (response.status === 200) {
                    const data = response.data;

                    // Ambil data mentah dari respons API
                    const rawTraining: string[][] = data?.training ?? [];
                    const rawKriteria: string[] = data?.kriteria ?? [];
                    const labelOptions: LabelTypes[] = data?.label ?? [];

                    // Hentikan proses jika data penting tidak ada
                    if (rawTraining.length === 0 || rawKriteria.length === 0) {
                        console.warn('Data training atau kriteria dari API kosong.');
                        setDataTraining({ trainFeatures: [], trainLabelsY: [], testFeatures: [], testLabelsY: [] }); // Set ke state kosong yang valid
                        return;
                    }

                    // --- Proses data langsung dari variabel, bukan dari state ---
                    const features: number[][] = [];
                    const labelsY: number[] = [];

                    for (const row of rawTraining) {
                        const featureRow = row.slice(0, -1).map(Number);
                        features.push(featureRow);

                        const labelName = row[row.length - 1];
                        // Cari ID label menggunakan data label yang baru saja diambil dari API
                        const labelId = labelOptions.find((label) => label.nama === labelName)?.id || 0;
                        labelsY.push(labelId);
                    }

                    const { trainFeatures, trainLabelsY, testFeatures, testLabelsY } = splitDataTraining(features, labelsY, 0.8);

                    // Set state final setelah semua data berhasil diolah
                    setDataTraining({
                        trainFeatures,
                        trainLabelsY,
                        testFeatures,
                        testLabelsY,
                    });
                } else {
                    throw new Error(`API mengembalikan status ${response.status}`);
                }
            } catch (err) {
                console.error('Terjadi kesalahan ketika memuat dan memproses dataset', err);
                setError('Gagal memuat dataset.');
            } finally {
                // Hentikan loading baik berhasil maupun gagal
                setIsLoading(false);
            }
        };

        fetchAndProcessData();

        // Dependency array kosong [] sudah benar, agar hook ini hanya berjalan sekali saat komponen dimuat.
    }, []);

    return { dataTraining, isLoading, error };
}
