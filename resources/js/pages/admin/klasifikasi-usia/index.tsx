import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, KlasifikasiUsiaTypes, KriteriaTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, PenBox } from 'lucide-react';
import { useMemo, useState } from 'react';
interface LabelIndexProps {
    label: KriteriaTypes[];
    listKlasifikasiUsia: KlasifikasiUsiaTypes[];
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    can?: {
        add: boolean;
        edit: boolean;
        read: boolean;
        delete: boolean;
    };
}
type labelFormData = {
    id: number | null;
    min_usia: number | null;
    max_usia: number | null;
    sayuran: string;
    porsi: string;
    tekstur: string;
    frekuensi: string;
};

export default function LabelIndex({ label, listKlasifikasiUsia, breadcrumb, titlePage, can }: LabelIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, post, put, processing, errors, reset } = useForm<labelFormData>({
        id: null,
        min_usia: null,
        max_usia: null,
        sayuran: '',
        porsi: '',
        tekstur: '',
        frekuensi: '',
    });

    const [editId, setEditId] = useState<number | null>(null);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editId == null) {
            post(route('admin.klasifikasiUsia.store'), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        min_usia: null,
                        max_usia: null,
                        sayuran: '',
                        porsi: '',
                        tekstur: '',
                        frekuensi: '',
                    });
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        } else {
            put(route('admin.klasifikasiUsia.update', { klasifikasiUsia: editId }), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        min_usia: null,
                        max_usia: null,
                        sayuran: '',
                        porsi: '',
                        tekstur: '',
                        frekuensi: '',
                    });
                    setEditId(null);
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleEdit = (id: number) => {
        if (id) {
            const klasifikasiUsiaTemp: KlasifikasiUsiaTypes[] = listKlasifikasiUsia.filter((item) => item.id === id, []);
            setEditId(klasifikasiUsiaTemp[0].id);
            if (klasifikasiUsiaTemp) {
                setData('id', klasifikasiUsiaTemp[0].id);
                setData('min_usia', klasifikasiUsiaTemp[0].min_usia);
                setData('max_usia', klasifikasiUsiaTemp[0].max_usia);
                setData('sayuran', klasifikasiUsiaTemp[0].sayuran);
                setData('porsi', klasifikasiUsiaTemp[0].porsi);
                setData('tekstur', klasifikasiUsiaTemp[0].tekstur);
                setData('frekuensi', klasifikasiUsiaTemp[0].frekuensi);
            }
            setIsOpenDialog(true);
        }
    };

    const closeDialog = () => {
        setIsOpenDialog(false);
        reset();
        setEditId(null);
    };
    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Label'} />

            {/* Data */}
            <Card>
                <div className="px-2">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Data Klasifikasi Usia Anak</h2>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            {can?.add && (
                                <Button variant={'default'} type="button" className="cursor-pointer" onClick={() => setIsOpenDialog(true)}>
                                    Tambah Data
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-sm border">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer">no</TableHead>
                                    <TableHead className="cursor-pointer">Usia</TableHead>
                                    <TableHead className="cursor-pointer">sayuran</TableHead>
                                    <TableHead className="cursor-pointer">Porsi</TableHead>
                                    <TableHead className="cursor-pointer">Tekstur</TableHead>
                                    <TableHead className="cursor-pointer">Frekuensi</TableHead>
                                    {(can?.delete || can?.edit) && <TableHead className="cursor-pointer">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listKlasifikasiUsia.length > 0 ? (
                                    listKlasifikasiUsia.map((item: KlasifikasiUsiaTypes, index: number) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.min_usia + '-' + item.max_usia} tahun</TableCell>
                                            <TableCell>{item.sayuran}</TableCell>
                                            <TableCell>{item.porsi}</TableCell>
                                            <TableCell>{item.tekstur}</TableCell>
                                            <TableCell>{item.frekuensi}</TableCell>
                                            {(can?.edit || can?.delete) && (
                                                <TableCell>
                                                    <div className="flex flex-row items-center gap-2">
                                                        {can?.edit && (
                                                            <Button
                                                                type="button"
                                                                variant={'default'}
                                                                tooltip="edit"
                                                                onClick={() => handleEdit(item.id)}
                                                                className="border border-chart-4 bg-chart-4"
                                                            >
                                                                {' '}
                                                                <PenBox />{' '}
                                                            </Button>
                                                        )}

                                                        {can?.delete && (
                                                            <DeleteConfirmationForm
                                                                title={`Hapus label ${item.id}`}
                                                                id={item.id}
                                                                url={route('admin.klasifikasiUsia.destroy', { klasifikasiUsia: item.id })}
                                                                setOpenDialog={setisDeleteDialog}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-4 text-center">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>

            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? `Edit` : `Tambah`} Data Klasifikasi Usia</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="flex flex-wrap gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="min_usia" className="text-sm font-medium">
                                        Masukkan Min Usia
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.min_usia ?? ''}
                                        onChange={(e) => setData('min_usia', Number(e.target.value))}
                                        id="min_usia"
                                        name="min_usia"
                                        className="input"
                                        disabled={processing}
                                        placeholder="Masukkan nama-nama min_usia"
                                    />
                                    <InputError message={errors.min_usia} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="max_usia" className="text-sm font-medium">
                                        Masukkan Max usia
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.max_usia ?? ''}
                                        onChange={(e) => setData('max_usia', Number(e.target.value))}
                                        id="max_usia"
                                        name="max_usia"
                                        className="input"
                                        disabled={processing}
                                        placeholder="Masukkan nama-nama max_usia"
                                    />
                                    <InputError message={errors.max_usia} className="mt-2" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sayuran" className="text-sm font-medium">
                                    Nama Sayuran
                                </Label>
                                <Input
                                    type="text"
                                    value={data.sayuran}
                                    onChange={(e) => setData('sayuran', e.target.value)}
                                    id="sayuran"
                                    name="sayuran"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan nama-nama sayuran"
                                />
                                <InputError message={errors.sayuran} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="porsi" className="text-sm font-medium">
                                    Jumlah Porsi Makanan
                                </Label>
                                <Input
                                    type="text"
                                    value={data.porsi}
                                    onChange={(e) => setData('porsi', e.target.value)}
                                    id="porsi"
                                    name="porsi"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan porsi"
                                />
                                <InputError message={errors.porsi} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tekstur" className="text-sm font-medium">
                                    Tekstur Makanan
                                </Label>
                                <Input
                                    type="text"
                                    value={data.tekstur}
                                    onChange={(e) => setData('tekstur', e.target.value)}
                                    id="tekstur"
                                    name="tekstur"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan tekstur"
                                />
                                <InputError message={errors.tekstur} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="frekuensi" className="text-sm font-medium">
                                    Frekuensi Per Hari
                                </Label>
                                <Input
                                    type="text"
                                    value={data.frekuensi}
                                    onChange={(e) => setData('frekuensi', e.target.value)}
                                    id="frekuensi"
                                    name="frekuensi"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan frekuensi"
                                />
                                <InputError message={errors.frekuensi} className="mt-2" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => closeDialog()}>
                                Batal
                            </Button>
                            <Button type="submit">{processing && <LoaderCircle className="h-4 w-4 animate-spin" />}Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
