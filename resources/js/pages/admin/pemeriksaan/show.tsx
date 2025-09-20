import TableDatasetSayuran from '@/components/table-dataset-sayuran';
import TableKlasifikasiUsia from '@/components/table-klasifikasi-usia';
import TableLabelSayuran from '@/components/table-label-sayuran';
import AppLayout from '@/layouts/app-layout';
import { BalitaTypes, DetailPemeriksaanTypes, PemeriksaanTypes, SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Baby, ClipboardList, User2 } from 'lucide-react';
import { useMemo } from 'react';

interface PolaMakan {
    id: string;
    rekomendasi: string;
    catatan_dokter: string;
}
interface Attribut {
    id: string;
    nama: string;
}
export interface PemeriksaanProps {
    orangTua: User;
    balita: BalitaTypes;
    pemeriksaan: PemeriksaanTypes;
    detail: DetailPemeriksaanTypes[];
    polamakan: PolaMakan;
    kriteria: Attribut[];
    dataPemeriksaanBalita: PemeriksaanTypes[];
    breadcrumb: { title: string; href: string }[];
}

export default function PemeriksaanShow({
    pemeriksaan,
    balita,
    orangTua,
    detail,
    kriteria,
    polamakan,
    dataPemeriksaanBalita,
    breadcrumb,
}: PemeriksaanProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const handleDownloadStart = () => {
        console.log('Download started');
    };

    const handleDownloadSuccess = () => {
        console.log('Download completed successfully');
    };

    const handleDownloadError = (error: unknown) => {
        console.error('Download failed:', error);
    };
    const searchById = (id: string, detail: { kriteria_id: string; nilai: string }[]): string => {
        if (!detail || !id) return '';
        try {
            const foundElement = detail.find((element) => String(element.kriteria_id).includes(id));
            return foundElement?.nilai ?? '';
        } catch (error) {
            console.error('Error in searchById:', error);
            return '';
        }
    };
    const page = usePage<SharedData>();
    const { defaultUrl } = page.props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pemeriksaan" />
            <div className="flex h-full flex-1 flex-col rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                <div className="flex-1 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl p-4 lg:p-6">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Pemeriksaan</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(pemeriksaan.tgl_pemeriksaan).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Left Column - Parent & Child Data */}
                            <div className="space-y-6">
                                {/* Parent Data Card */}
                                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                                        <User2 className="h-5 w-5" />
                                        Data Orang Tua
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Nama Orang Tua', value: orangTua.name },
                                            { label: 'Email', value: orangTua.email },
                                            { label: 'Alamat', value: orangTua.alamat },
                                        ].map((item) => (
                                            <div key={item.label} className="grid grid-cols-3 gap-4">
                                                <span className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                                                <span className="col-span-2 text-sm text-gray-900 dark:text-gray-100">{item.value || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Child Data Card */}
                                <div className="rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-800 dark:text-green-200">
                                        <Baby className="h-5 w-5" />
                                        Data Balita
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'NIK', value: balita.nik },
                                            { label: 'Nama', value: balita.nama },
                                            { label: 'Tempat Lahir', value: balita.tempat_lahir },
                                            { label: 'Tanggal Lahir', value: balita.tanggal_lahir },
                                            { label: 'Jenis Kelamin', value: balita.jenis_kelamin },
                                        ].map((item) => (
                                            <div key={item.label} className="grid grid-cols-3 gap-4">
                                                <span className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                                                <span className="col-span-2 text-sm text-gray-900 dark:text-gray-100">{item.value || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Examination Data */}
                            <div className="space-y-6">
                                {/* Examination Data Card */}
                                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-900/20">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-800 dark:text-purple-200">
                                        <ClipboardList className="h-5 w-5" />
                                        Data Pemeriksaan
                                    </h3>
                                    <div className="space-y-3">
                                        {/* <div className="grid grid-cols-3 gap-4">
                                            <span className="col-span-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Nomor RME (Rekam Medis Elekronik)
                                            </span>
                                            <span className="col-span-1 text-sm text-gray-900 dark:text-gray-100">{pemeriksaan.rme}</span>
                                        </div> */}
                                        {detail
                                            .filter((attr) => !['jenis kelamin'].includes(attr.kriteria.nama.toLowerCase()))
                                            .map((item) => (
                                                <div key={item.kriteria.nama} className="grid grid-cols-3 gap-4">
                                                    <span className="col-span-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        {item.kriteria.nama}
                                                    </span>
                                                    <span className="col-span-1 text-sm text-gray-900 dark:text-gray-100">{item.nilai}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full flex flex-col gap-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/20">
                                <TableKlasifikasiUsia data={pemeriksaan.klasifikasiUsia} />
                                <TableLabelSayuran data={pemeriksaan.statusGizi} />
                                <TableDatasetSayuran data={pemeriksaan.rekomendasi} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
