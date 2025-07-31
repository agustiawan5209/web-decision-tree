/* eslint-disable react-hooks/exhaustive-deps */
import { LabelTypes } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Interface tidak berubah
interface TrainingData {
    features: number[][];
    labels: number[];
    featureNames: string[];
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
                        console.warn("Data training atau kriteria dari API kosong.");
                        setTrainingData({ features: [], labels: [], featureNames: [] }); // Set ke state kosong yang valid
                        return;
                    }

                    // --- Proses data langsung dari variabel, bukan dari state ---
                    const features: number[][] = [];
                    const labels: number[] = [];

                    for (const row of rawTraining) {
                        const featureRow = row.slice(0, -1).map(Number);
                        features.push(featureRow);

                        const labelName = row[row.length - 1];
                        // Cari ID label menggunakan data label yang baru saja diambil dari API
                        const labelId = labelOptions.find((label) => label.nama === labelName)?.id || 0;
                        labels.push(labelId);
                    }

                    // Set state final setelah semua data berhasil diolah
                    setTrainingData({
                        features,
                        labels,
                        featureNames: rawKriteria.slice(0, -1),
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
// const splitDataTraining = (features: number[][], labels: number[], splitRatio = 0.7) => {
//     const shuffledIndices = features.map((_, i) => i).sort(() => Math.random() - 0.5);
//     const splitIndex = Math.floor(features.length * splitRatio);

//     const trainFeatures = shuffledIndices.slice(0, splitIndex).map((i) => features[i]);
//     const trainLabels = shuffledIndices.slice(0, splitIndex).map((i) => labels[i]);
//     const testFeatures = shuffledIndices.slice(splitIndex).map((i) => features[i]);
//     const testLabels = shuffledIndices.slice(splitIndex).map((i) => labels[i]);

//     return { trainFeatures, trainLabels, testFeatures, testLabels };
// };
