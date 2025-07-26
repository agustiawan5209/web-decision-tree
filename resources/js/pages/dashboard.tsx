import KPICard from '@/components/dashboard/KPICard';
import AppLayout from '@/layouts/app-layout';
import { LabelTypes, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface GuestDashboardProps {
    meanKriteriaValue: string[];
    distributionLabel: string[];
    label: LabelTypes[];
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'GuestDashboard',
        href: '/dashboard',
    },
];
export default function Dashboard({ meanKriteriaValue, distributionLabel, label }: GuestDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-foreground">Jenis Sayuran</h1>
                    <p className="mt-1 text-muted-foreground">Monitor and maintain optimal growing conditions</p>
                </header>

                {/* Metric Cards */}
                <section className="mb-8 flex gap-3">
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {label.map((item: any, index) => (
                                <KPICard
                                    key-={item.id}
                                    title={`Jumlah Dataset ${item.nama}`}
                                    value={distributionLabel[item.nama].length}
                                    unit={'data'}
                                    status="normal"
                                    trend="stable"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1/3 space-y-2 rounded bg-gray-50 p-4">
                        <h4 className="mb-2 font-medium">Rata Rata Kriteria Untuk Nutrisi Sangat Baik</h4>
                        <ul className="space-y-1">
                            {meanKriteriaValue &&
                                Object.entries(meanKriteriaValue).map(([feature, importance], index) => (
                                    <li key={index} className="text-sm">
                                        {feature}: {typeof importance === 'string' ? importance : Number(importance).toFixed(4)}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
