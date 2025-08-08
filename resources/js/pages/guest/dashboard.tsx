/* eslint-disable @typescript-eslint/no-explicit-any */
import KPICard from '@/components/dashboard/KPICard';
import HeroSection from '@/components/hero-section';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';
import { LabelTypes } from '@/types';
import { Head } from '@inertiajs/react';

interface GuestDashboardProps {
    meanKriteriaValue: string[];
    distributionLabel: string[];
    label: LabelTypes[];
     training: number;
    kriteria: number;
}

export default function GuestDashboard({ distributionLabel, label , training,kriteria}: GuestDashboardProps) {
    return (
        <UserAuthLayout>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="mt-1 text-muted-foreground">Dashboard Rekomendasi Jenis Sayuran Berdasarkan Nutrisi Anak</p>
                </header>

                {/* Metric Cards */}
                <section className="mb-8 flex gap-3">
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            <KPICard title={`Total Dataset`} value={training} unit={'data'} status="normal" trend="up" />
                            <KPICard title={`Total Kriteria`} value={kriteria} unit={'data'} status="normal" trend="up" />
                        </div>
                    </div>
                </section>
                {/* Hero Section */}
                <section className="px-4 py-20">
                    <HeroSection />
                </section>
            </div>
        </UserAuthLayout>
    );
}
