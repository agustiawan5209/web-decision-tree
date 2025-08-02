/* eslint-disable @typescript-eslint/no-explicit-any */
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
export default function Dashboard({ distributionLabel, label }: GuestDashboardProps) {
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {label.map((item: any, index) => (
                                <KPICard
                                    key={index}
                                    title={`Jumlah Dataset ${item.nama}`}
                                    value={distributionLabel[item.nama].length}
                                    unit={'data'}
                                    status="normal"
                                    trend="up"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
