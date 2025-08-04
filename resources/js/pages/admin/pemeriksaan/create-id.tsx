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
        orang_tua_id: '',
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        tanggal_pemeriksaan: day,
        kriteria: kriteria.map((attr) => ({ nilai: null, kriteria_id: attr.id.toString(), name: attr.nama })),
        label: '',
        alasan: '',
        rekomendasi: '',
        usia_balita: '',
        detail: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.label == '') {
            setData('label', prediction?.label?.toString() ?? '');
        }
        post(route('pemeriksaan.store'), {
            onError: (errors) => {
                console.log(errors)
                setToast({
                    title: 'Error',
                    show: true,
                    message: JSON.stringify(errors),
                    type: 'error',
                })
            },
        });
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
                                    <div className="block space-y-4 rounded-lg border p-2">
                                        <div className="flex gap-2">
                                            <Label className="text-muted-foreground">
                                                Nama Orang Tua/<i>Mewakili</i>:
                                            </Label>
                                            <Label className="font-normal">{selectedOrangtua.name}</Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Label className="text-muted-foreground">Email Orang Tua:</Label>
                                            <Label className="font-normal">{selectedOrangtua.email}</Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Label className="text-muted-foreground">Alamat Orang Tua:</Label>
                                            <Label className="font-normal">{selectedOrangtua.alamat}</Label>
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
