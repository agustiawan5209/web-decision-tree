import ClassifyPemeriksaan from '@/components/classify-pemeriksaan';
import InputError from '@/components/input-error';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { KriteriaTypes, PredictionResult, SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
interface OrangTua {
    id: string;
    name: string;
    email: string;
    alamat: string;
    nohp: string;
    password: string;
}

export interface BalitaTypes {
    id: string;
    nama: string;
    tanggal_lahir: string;
    tempat_lahir: string;
    orangtua: {
        name: string;
    };
    jenis_kelamin: string;
    alamat: string;
}

export interface PemeriksaanCreateProps {
    breadcrumb?: { title: string; href: string }[];
    balita: BalitaTypes[];
    kriteria: KriteriaTypes[];
    orangtua: OrangTua[];
}

type CreateForm = {
    rme: string;
    orang_tua_id: string;
    nik: string;
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
    rekomendasi: string[];
    gejala: string;
    usia_balita: string;
    detail: string[];
    klasifikasiUsia: string[];
    statusGizi: string[];
};

export default function PemeriksaanCreate({ breadcrumb, balita, kriteria, orangtua }: PemeriksaanCreateProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
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
    const { auth } = usePage<SharedData>().props;
    const today = new Date();
    const day = today.toISOString().split('T')[0];
    const { data, setData, get, post, processing, errors } = useForm<CreateForm>({
        rme: '',
        orang_tua_id: '',
        nik: '',
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        tanggal_pemeriksaan: day,
        kriteria: kriteria.map((attr) => ({ nilai: null, kriteria_id: attr.id.toString(), name: attr.nama })),
        label: '',
        alasan: '',
        rekomendasi: [],
        gejala: '',
        usia_balita: '',
        detail: [],
        klasifikasiUsia: [],
        statusGizi: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.label == '') {
            setData('label', prediction?.label?.toString() ?? '');
        } else {
            post(route('pemeriksaan.store', { label: prediction?.label?.toString() }), {
                onError: (errors) => {
                    setToast({
                        title: 'Error',
                        show: true,
                        message: JSON.stringify(errors),
                        type: 'error',
                    });
                },
                preserveState: true,
            });
        }
    };
    // State for selected parent
    const [selectedOrangtua, setSelectedOrangtua] = useState<OrangTua | null>(null);
    const [idOrangTua, setIdOrangTua] = useState('');
    // Optimized parent search function
    const searchById = useCallback(
        (search: string): OrangTua | null => {
            if (!orangtua?.length || !search) return null;
            return orangtua.find((element) => element.id === search) ?? null;
        },
        [orangtua],
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [listOrangTua, setListOrangTua] = useState<OrangTua[]>([]);
    const [showlist, setShowList] = useState(false);
    const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSearchTerm(input);
        if (input.length > 2) {
            const filteredList = orangtua.filter(
                (orangtua) => orangtua.name.toLowerCase().includes(input.toLowerCase()) || orangtua.email.toLowerCase().includes(input.toLowerCase()),
            );
            if (filteredList.length > 0) {
                setListOrangTua(filteredList);
                setShowList(true);
                errors.orang_tua_id = '';
            } else {
                errors.orang_tua_id = 'Nama Orang Tua/Wali Tidak Terdaftar';
            }
        } else {
            setListOrangTua([]);
            setShowList(false);
            errors.orang_tua_id = 'Nama Orang Tua/Wali Tidak Terdaftar';
        }
    };

    // Effect for handling parent selection
    useEffect(() => {
        if (idOrangTua) {
            const foundParent = searchById(idOrangTua);
            setSelectedOrangtua(foundParent);
            if (foundParent) {
                setShowList(false);
                setData('orang_tua_id', foundParent.id);
                setData('alamat', foundParent.alamat);
            }
        }
    }, [idOrangTua, searchById, setData]);
    useEffect(() => {
        if (prediction && prediction.label) {
            setData('label', prediction.label.toString());
        }
    }, [prediction]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={5000}
                variant={toast.type}
            />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <Card>
                        <CardContent>
                            <div className="grid gap-6">
                                {/* <div className="grid gap-2">
                                    <Label htmlFor="rme">No. RME (Rekam Medis Elekronik) </Label>
                                    <Input
                                        id="rme"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="rme"
                                        value={data.rme}
                                        onChange={(e) => setData({ ...data, rme: e.target.value })}
                                        disabled={processing}
                                        placeholder="Masukkan Nomor Rekam Medis Elektronik"
                                    />
                                    <InputError message={errors.rme} className="mt-2" />
                                </div> */}
                                <div className="grid gap-2">
                                    <Label htmlFor="orang_tua">Nama Orang Tua</Label>
                                    <div className="relative w-full p-2">
                                        <Input
                                            type="search"
                                            id="orang_tua"
                                            placeholder="cari berdasarkan nama atau email yang terdaftar"
                                            required
                                            value={searchTerm}
                                            onChange={(e) => handleSearchUser(e)}
                                        />
                                        {showlist && (
                                            <div className="absolute top-10 rounded-xl bg-white p-2 shadow-lg">
                                                <ul>
                                                    {listOrangTua.map((orangtua) => (
                                                        <li
                                                            key={orangtua.id}
                                                            onClick={() => setIdOrangTua(orangtua.id)}
                                                            className="cursor-pointer p-2 hover:bg-gray-200"
                                                        >
                                                            {orangtua.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.orang_tua_id} />
                                </div>

                                {selectedOrangtua && (
                                    <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
                                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Informasi Orang Tua</h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Nama Orang Tua/Mewakili</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedOrangtua.name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedOrangtua.email}</p>
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Alamat</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedOrangtua.alamat}</p>
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">No. Hp/Whatsapp</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedOrangtua.nohp}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {kriteria && (
                                <div className="mt-6">
                                    <ClassifyPemeriksaan
                                        submit={submit}
                                        kriteria={kriteria}
                                        setResult={setPrediction}
                                        data={data}
                                        setData={setData as any}
                                        processing={processing}
                                        errors={errors as any}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
