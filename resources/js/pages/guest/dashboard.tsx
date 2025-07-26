import KPICard from '@/components/dashboard/KPICard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';
import { LabelTypes, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

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

export default function GuestDashboard({ meanKriteriaValue, distributionLabel, label }: GuestDashboardProps) {
    return (
        <UserAuthLayout>
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
                {/* Hero Section */}
                <section className="px-4 py-20">
                    <div className="container mx-auto text-center">
                        <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">🚀 Teknologi AI Terdepan untuk Hidroponik</Badge>
                        <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
                            Sistem Pendukung Keputusan untuk
                            <span className="block text-green-600">Nutrisi Tanaman Hidroponik</span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
                            Menggunakan Algoritma Decision Tree dan Kecerdasan Buatan untuk memberikan rekomendasi nutrisi yang optimal, meningkatkan
                            hasil panen, dan membantu petani hidroponik mencapai efisiensi maksimal.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href={route('guest.klasifikasi.index')}>
                                <Button size="lg" className="bg-green-600 px-8 py-3 text-lg hover:bg-green-700">
                                    Mulai Sekarang
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </UserAuthLayout>
    );
}
