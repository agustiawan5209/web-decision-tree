import AppLayout from '@/layouts/app-layout';
import { PemeriksaanTypes, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Baby, ClipboardList, User2 } from 'lucide-react';
import { useMemo } from 'react';

interface OrangTua {
    name: string;
    email: string;
}

interface Balita {
    id: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    usia: string;
    jenis_kelamin: string;
    alamat: string;
}


interface DetailPemeriksaan {
    kriteria: {
        nama: string;
    };
    nilai: number | string;
}
interface Attribut {
    id: string;
    nama: string;
}

export interface PemeriksaanProps {
    orangTua: OrangTua;
    balita: Balita;
    pemeriksaan: PemeriksaanTypes[];
    detail: DetailPemeriksaan[];
    kriteria: Attribut[];
    breadcrumb: { title: string; href: string }[];
}

export default function PemeriksaanShow({ pemeriksaan, balita, orangTua, kriteria, breadcrumb }: PemeriksaanProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const searchById = (id: string, detail: { kriteria_id: number; nilai: string }[]): string => {
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

    const handleDownloadStart = () => {
        console.log('Download started');
    };

    const handleDownloadSuccess = () => {
        console.log('Download completed successfully');
    };

    const handleDownloadError = (error: unknown) => {
        console.error('Download failed:', error);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pemeriksaan" />
            <div className="flex h-full flex-1 flex-col rounded-xl bg-gray-50 p-2 lg:p-4 dark:bg-gray-900">
                <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto max-w-full p-4 lg:p-6">
                        {/* Header Section */}

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Left Column - Parent & Child Data */}
                            <div className="space-y-4">
                                {/* Parent Data Card */}
                                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                                        <User2 className="h-5 w-5" />
                                        Data Orang Tua
                                    </h3>
                                    <div className="space-y-2">
                                        <DataRow label="Nama Orang Tua" value={orangTua.name} />
                                        <DataRow label="Email" value={orangTua.email} />
                                        <DataRow label="Alamat" value={balita.alamat} />
                                    </div>
                                </div>

                                {/* Child Data Card */}
                                <div className="rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
                                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-800 dark:text-green-200">
                                        <Baby className="h-5 w-5" />
                                        Data Balita
                                    </h3>
                                    <div className="space-y-2">
                                        <DataRow label="Nama Balita/Anak" value={balita.nama} />
                                        <DataRow label="Tempat Lahir" value={balita.tempat_lahir} />
                                        <DataRow label="Tanggal Lahir" value={balita.tanggal_lahir} />
                                        <DataRow label="Jenis Kelamin" value={balita.jenis_kelamin} />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Examination Data */}
                            <div className="space-y-4">
                                {/* Examination Data Card */}
                                <div className="overflow-hidden rounded-lg border border-purple-100 bg-purple-50 shadow-sm dark:border-purple-900/50 dark:bg-purple-900/20">
                                    <h3 className="flex items-center gap-2 border-b border-purple-200 bg-purple-100 p-4 text-lg font-semibold text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                                        <ClipboardList className="h-5 w-5" />
                                        Data Pemeriksaan
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-purple-50 dark:bg-purple-900/10">
                                                <tr>
                                                    <th className="w-12 px-4 py-3 text-left text-xs font-medium text-purple-800 dark:text-purple-200">
                                                        No.
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 dark:text-purple-200">
                                                        Tanggal
                                                    </th>
                                                    {kriteria.map((item) => (
                                                        <th
                                                            key={item.id}
                                                            className="px-4 py-3 text-left text-xs font-medium text-purple-800 dark:text-purple-200"
                                                        >
                                                            {item.nama}
                                                        </th>
                                                    ))}
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 dark:text-purple-200">
                                                        Status Nutrisi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-purple-100 dark:divide-purple-900/30">
                                                {pemeriksaan?.length > 0 ? (
                                                    pemeriksaan.map((item, index) => (
                                                        <tr key={index} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                                {item.tgl_pemeriksaan}
                                                            </td>
                                                            {kriteria.map((kriterias) => (
                                                                <td
                                                                    key={kriterias.id}
                                                                    className="px-4 py-3 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300"
                                                                >
                                                                    {searchById(kriterias.id, item.detailpemeriksaan)}
                                                                </td>
                                                            ))}
                                                            <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                                {item.label}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={kriteria.length + 2}
                                                            className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                                                        >
                                                            Tidak ada data pemeriksaan
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function DataRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-3 gap-2">
            <span className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <span className="col-span-2 text-sm text-gray-900 dark:text-gray-100">{value || '-'}</span>
        </div>
    );
}
