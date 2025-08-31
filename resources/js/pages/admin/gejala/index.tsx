import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, KriteriaTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, PenBox } from 'lucide-react';
import { useMemo, useState } from 'react';
interface GejalaIndexProps {
    gejala: KriteriaTypes[];
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    can?: {
        add: boolean;
        edit: boolean;
        read: boolean;
        delete: boolean;
    };
}
type gejalaFormData = {
    id: number | null;
    nama: string;
    deskripsi: string;
};

export default function GejalaIndex({ gejala, breadcrumb, titlePage, can }: GejalaIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, post, put, processing, errors } = useForm<gejalaFormData>({
        id: null,
        nama: '',
        deskripsi: '',
    });

    const [editId, setEditId] = useState<number | null>(null);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editId == null) {
            post(route('admin.gejala.store'), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        nama: '',
                        deskripsi: '',
                    });
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        } else {
            put(route('admin.gejala.update', { gejala: editId }), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        nama: '',
                        deskripsi: '',
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
            const gejalaTemp: KriteriaTypes[] = gejala.filter((item) => item.id === id, []);
            setEditId(gejalaTemp[0].id);
            if (gejalaTemp) {
                setData({
                    id: gejalaTemp[0].id,
                    nama: gejalaTemp[0].nama,
                    deskripsi: gejalaTemp[0].deskripsi,
                });
            }
            setIsOpenDialog(true);
        }
    };

    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Gejala'} />

            {/* Data */}
            <Card>
                <div className="container mx-auto px-4">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Gejala Nutrisi Anak</h2>
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
                                    <TableHead className="cursor-pointer">Nama</TableHead>
                                    {(can?.delete || can?.edit) && <TableHead className="cursor-pointer">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gejala.length > 0 ? (
                                    gejala.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
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
                                                                title={`Hapus gejala ${item.id}`}
                                                                id={item.id}
                                                                url={route('admin.gejala.destroy', { gejala: item.id })}
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
                                        <TableCell colSpan={4} className="py-4 text-center">
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
                        <DialogTitle>{editId ? `Edit` : `Tambah`} Gejala</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-sm font-medium">
                                    Nama Gejala
                                </Label>
                                <Input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    id="nama"
                                    name="nama"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan nama gejala"
                                />
                                <InputError message={errors.nama} className="mt-2" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setIsOpenDialog(false)}>
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
