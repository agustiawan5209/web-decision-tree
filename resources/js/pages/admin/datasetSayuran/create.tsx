import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { DatasetSayuranTypes, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export interface DatasetSayuranCreateProps {
    breadcrumb?: { title: string; href: string }[];
    gejala: {
        id: string;
        nama: string;
    }[];
    label: {
        id: string;
        nama: string;
    }[];
    datasetSayuran?: DatasetSayuranTypes;
}

type CreateForm = {
    id: number;
    nama_sayuran: string;
    nutrisi: string;
    manfaat: string;
    status: string;
    gejala: string;
    porsi: string;
    porsi_hari: string;
    penyajian: string;
};

export default function DatasetSayuranCreate({ breadcrumb, gejala, label, datasetSayuran }: DatasetSayuranCreateProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    // Parse gejala from string to array if datasetSayuran exists
    const initialGejala = useMemo(() => {
        if (datasetSayuran?.gejala) {
            if (typeof datasetSayuran.gejala === 'string') {
                try {
                    return JSON.parse(datasetSayuran.gejala);
                } catch (e) {
                    return datasetSayuran.gejala.split(',').map((item) => item.trim());
                }
            }
            return datasetSayuran.gejala;
        }
        return [];
    }, [datasetSayuran]);

    const initialLabel = useMemo(() => {
        if (datasetSayuran?.status) {
            if (typeof datasetSayuran.status === 'string') {
                try {
                    return JSON.parse(datasetSayuran.status);
                } catch (e) {
                    return datasetSayuran.status.split(',').map((item) => item.trim());
                }
            }
            return datasetSayuran.status;
        }
        return [];
    }, [datasetSayuran]);

    const [inputGejala, setInputGejala] = useState<string[]>(initialGejala);
    const [inputLabel, setInputLabel] = useState<string[]>(initialLabel);

    const { data, setData, post, processing, errors, reset } = useForm<CreateForm>({
        id: datasetSayuran?.id ?? 0,
        nama_sayuran: datasetSayuran?.nama_sayuran ?? '',
        nutrisi: datasetSayuran?.nutrisi ?? '',
        manfaat: datasetSayuran?.manfaat ?? '',
        status: '',
        gejala: '',
        porsi: datasetSayuran?.porsi ?? '40 - 50 gram ',
        porsi_hari: datasetSayuran?.porsi_hari ?? '50 - 70 gram',
        penyajian: datasetSayuran?.penyajian ?? '',
    });

    // Update form data when inputGejala or inputLabel changes
    useEffect(() => {
        setData('gejala', inputGejala.join(', '));
        setData('status', inputLabel.join(', '));
    }, [inputGejala, inputLabel, setData]);

    /**
     * Handles the form submission. Prevents the default form submission,
     * then makes a POST request to the server to store the new DatasetSayuran.
     * If there's an error, logs the error to the console.
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.datasetSayuran.store'), {
            onError: (err) => console.log(err),
        });
    };

    // Prepare options for react-select
    const options = useMemo(() => gejala.map((item) => ({ value: item.nama, label: item.nama })), [gejala]);

    const optionsLabel = useMemo(() => label.map((item) => ({ value: item.nama, label: item.nama })), [label]);

    // Get selected values for react-select
    const selectedValues = useMemo(() => options.filter((option) => inputGejala.includes(option.value)), [options, inputGejala]);

    const selectedLabel = useMemo(() => optionsLabel.filter((option) => inputLabel.includes(option.value)), [optionsLabel, inputLabel]);

    const animatedComponents = makeAnimated();

    // Handle select change
    const handleGejalaChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setInputGejala(selectedValues);
    };

    const handleStatusChange = (selectedOptions: any) => {
        const selectedLabel = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setInputLabel(selectedLabel);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={datasetSayuran ? 'Edit Dataset Sayuran' : 'Tambah Dataset Sayuran'} />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama_sayuran">Nama Sayuran</Label>
                                        <Input
                                            id="nama_sayuran"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="nama_sayuran"
                                            value={data.nama_sayuran}
                                            onChange={(e) => setData('nama_sayuran', e.target.value)}
                                            disabled={processing}
                                            placeholder="Nama Sayuran"
                                        />
                                        <InputError message={errors.nama_sayuran} className="mt-2" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="nutrisi">Nutrisi Buah</Label>
                                        <Input
                                            id="nutrisi"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            autoComplete="nutrisi"
                                            value={data.nutrisi}
                                            onChange={(e) => setData('nutrisi', e.target.value)}
                                            disabled={processing}
                                            placeholder="Nutrisi pada buah"
                                        />
                                        <InputError message={errors.nutrisi} className="mt-2" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="manfaat">Manfaat</Label>
                                        <Input
                                            id="manfaat"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            autoComplete="manfaat"
                                            value={data.manfaat}
                                            onChange={(e) => setData('manfaat', e.target.value)}
                                            disabled={processing}
                                            placeholder="Manfaat sayuran"
                                        />
                                        <InputError message={errors.manfaat} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="penyajian">Cara Penyajian</Label>
                                        <Input
                                            id="penyajian"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            autoComplete="penyajian"
                                            value={data.penyajian}
                                            onChange={(e) => setData('penyajian', e.target.value)}
                                            disabled={processing}
                                            placeholder="Masukkan Cara Penyajian Makanan"
                                        />
                                        <InputError message={errors.penyajian} />
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="porsi">Porsi Per Saji (usia 1-3 Tahun)</Label>
                                        <Input
                                            id="porsi"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            autoComplete="porsi"
                                            value={data.porsi}
                                            onChange={(e) => setData('porsi', e.target.value)}
                                            disabled={processing}
                                            placeholder="Masukkan Porsi Per Saji (usia 1-3 Tahun)"
                                        />
                                        <InputError message={errors.porsi} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="porsi_hari">Porsi Per Saji (usia 4-6 Tahun)</Label>
                                        <Input
                                            id="porsi_hari"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            autoComplete="porsi_hari"
                                            value={data.porsi_hari}
                                            onChange={(e) => setData('porsi_hari', e.target.value)}
                                            disabled={processing}
                                            placeholder="Masukkan Porsi Per Saji (usia 4-6 Tahun)"
                                        />
                                        <InputError message={errors.porsi_hari} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="gejala">Gejala</Label>
                                        <Select
                                            id="gejala"
                                            name="gejala"
                                            value={selectedValues}
                                            onChange={handleGejalaChange}
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={options}
                                            isDisabled={processing}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            tabIndex={4}
                                            placeholder="Pilih gejala..."
                                        />
                                        <InputError message={errors.gejala} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Status Nutrisi</Label>
                                        <Select
                                            id="status"
                                            name="status"
                                            value={selectedLabel}
                                            onChange={handleStatusChange}
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={optionsLabel}
                                            isDisabled={processing}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            tabIndex={5}
                                            placeholder="Pilih status nutrisi..."
                                        />
                                        <InputError message={errors.status} />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <Button type="submit" variant={'default'} className="mt-2 w-full" tabIndex={6} disabled={processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        {datasetSayuran ? 'Update' : 'Simpan'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
