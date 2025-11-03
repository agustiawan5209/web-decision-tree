/* eslint-disable @typescript-eslint/no-explicit-any */
import KPICard from '@/components/dashboard/KPICard';
import AppLayout from '@/layouts/app-layout';
import { LabelTypes, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface GuestDashboardProps {
    meanKriteriaValue: string[];
    distributionLabel: string[];
    label: LabelTypes[];
    training: number;
    kriteria: number;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'GuestDashboard',
        href: '/dashboard',
    },
];
export default function Dashboard({ distributionLabel, label, training, kriteria }: GuestDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="mt-1 text-muted-foreground">Dashboard Rekomendasi Jenis Sayuran </p>
                </header>

                {/* Metric Cards */}
                <section className="mb-8 flex gap-3">
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* {label.map((item: any, index) => {
                                if (item.nama.toLowerCase() !== 'obesitas') {
                                }
                                return (
                                    <KPICard
                                        key={index}
                                        title={`Total Dataset ${item.nama}`}
                                        value={distributionLabel[item.nama].length}
                                        unit={'data'}
                                        status="normal"
                                        trend="up"
                                    />
                                );
                            })} */}
                            <KPICard title={`Total Dataset`} value={training} unit={'data'} status="normal" trend="up" />
                            <KPICard title={`Total Kriteria`} value={kriteria} unit={'data'} status="normal" trend="up" />
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
