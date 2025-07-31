/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import { useDataset } from '@/hooks/use-decision-tree';
import { KriteriaTypes } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { DecisionTreeClassifier } from 'ml-cart';
import React, { useState } from 'react';
import { Button } from './ui/button';

const opsiGejala = [
    { label: 'daun menguning', value: 0 },
    { label: 'pertumbuhan lambat', value: 1 },
    { label: 'ujung daun mengering', value: 2 },
    { label: 'daun sehat', value: 3 },
    { label: 'batang rapuh', value: 4 },
    { label: 'daun menggulung', value: 5 },
];
type Dataset = {
    jenis_kelamin: string;
    label: string;
    attribut: string[];
};

const FormClassifier = ({ kriteria }: { kriteria: KriteriaTypes[] }) => {
    const [treeModel, setTreeModel] = useState<DecisionTreeClassifier | null>(null);
    const [prediction, setPrediction] = useState<string>('');
    const { trainingData, isLoading } = useDataset();

    const [result, setResult] = useState<{ predict: string; text: string }>({
        predict: '',
        text: '',
    });

    const trainModel = () => {
        if (!isLoading) {
            const { features, labels }: { features: any; labels: any } = { features: trainingData?.features, labels: trainingData?.labels };

            const options = {
                gainFunction: 'gini',
                maxDepth: 3,
                minNumSamples: 1,
            };

            const classifier = new DecisionTreeClassifier(options);
            classifier.train(features, labels);
            setTreeModel(classifier);
        }
    };

    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, setData, post, processing, errors } = useForm<Dataset>({
        jenis_kelamin: '',
        label: '',
        attribut: kriteria.map(() => ''),
    });
    const [toast, setToast] = useState<{ title: string; show: boolean; message: string; type: 'success' | 'default' | 'error' }>({
        title: '',
        show: false,
        message: '',
        type: 'success',
    });

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
            if (name === 'label' || name === 'jenis_kelamin') {
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
        if (!treeModel) {
            console.log('tree model tidak dimuat!!', treeModel);
            return;
        }
        // const feature = Array(data.attribut)[0];
        // feature[feature.length] = data.jenis_kelamin.toLocaleLowerCase() == 'laki-laki' ? 0 : 1;
        // console.log(feature);
        setResult({ predict: '', text: '' });
    };

    return (
        <div className="mx-auto max-w-3xl">
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={5000}
                variant={toast.type}
            />

            <div className="mb-8">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">Nutrition Classification</h2>
                <p className="text-gray-600">Analyze children's nutrition status using decision tree algorithm</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Gender Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Gender</Label>
                        <Select value={data.jenis_kelamin} required onValueChange={(value) => handleSelectChange('jenis_kelamin', value)}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                {['laki-laki', 'perempuan'].map((item, index) => (
                                    <SelectItem key={index} value={item} className="px-4 py-2 hover:bg-gray-50">
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.jenis_kelamin && <InputError message={errors.jenis_kelamin} className="mt-1 text-sm text-red-600" />}
                    </div>

                    {/* Dynamic Criteria Inputs */}
                    {kriteria.map((item, index) => {
                        if (item.nama === 'gejala') {
                            return (
                                <div key={index} className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">{item.nama}</Label>
                                    <Select
                                        value={data.attribut[index] || ''}
                                        required
                                        onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                    >
                                        <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                            <SelectValue placeholder="Select symptoms" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                            {opsiGejala.map((gejala, idx) => (
                                                <SelectItem key={idx} value={gejala.label} className="px-4 py-2 hover:bg-gray-50">
                                                    {gejala.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{item.nama.charAt(0).toUpperCase() + item.nama.slice(1)}</Label>
                                <Input
                                    type="text"
                                    name={`attribut.${index}`}
                                    value={data.attribut[index] || ''}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Enter ${item.nama}`}
                                    disabled={processing}
                                    required
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-row gap-3">
                    <Button type="button" variant={'secondary'} onClick={() => trainModel()}>
                        Latih Model
                    </Button>
                    <Button type="submit" variant={'default'} disabled={loading}>
                        {loading || processing ? <Loader2 className="animate-spin" /> : 'Start Classification'}
                    </Button>
                </div>
            </form>

            {result && (
                <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start">
                        <div
                            className={`mt-1 h-4 w-4 flex-shrink-0 rounded-full ${
                                result.predict === 'Buruk'
                                    ? 'bg-red-500'
                                    : result.predict === 'Cukup'
                                      ? 'bg-yellow-500'
                                      : result.predict === 'Baik'
                                        ? 'bg-green-500'
                                        : 'bg-blue-500'
                            }`}
                        />
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-gray-900">Nutrition Classification Result</h3>
                            <div
                                className={`mt-1 text-lg font-semibold ${
                                    result.predict === 'Buruk'
                                        ? 'text-red-600'
                                        : result.predict === 'Cukup'
                                          ? 'text-yellow-600'
                                          : result.predict === 'Baik'
                                            ? 'text-green-600'
                                            : 'text-blue-600'
                                }`}
                            >
                                {result.predict}
                            </div>
                            <p className="mt-2 text-gray-600">{result.text}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormClassifier;
