import FormClassifier from '@/components/form-classifier';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/guest/main-layout';
import { JenisTanamanTypes, KriteriaTypes, LabelTypes } from '@/types';
import { Link } from '@inertiajs/react';

interface RandomForestViewProps {
    titlePage?: string;
    kriteria?: KriteriaTypes[];
    jenisTanaman?: JenisTanamanTypes[];
    opsiLabel: LabelTypes[];
}
export default function KlasifikasiView({ titlePage, kriteria, jenisTanaman, opsiLabel }: RandomForestViewProps) {
    return (
        <>
            <MainLayout>
                {kriteria && jenisTanaman && (
                    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                            <div className="p-6 sm:p-8">
                                <Link href={route('guest.dashboard')} >
                                    <Button type="button" variant={'outline'} className="mb-4">
                                        Kembali
                                    </Button>
                                </Link>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Klasifikasi Tanaman</h2>
                                    <p className="mt-1 text-gray-500 dark:text-gray-300">Masukkan kriteria untuk mendapatkan klasifikasi tanaman</p>
                                </div>
                                <FormClassifier kriteria={kriteria} jenisTanaman={jenisTanaman} opsiLabel={opsiLabel} />
                            </div>
                        </div>
                    </div>
                )}
            </MainLayout>
        </>
    );
}
