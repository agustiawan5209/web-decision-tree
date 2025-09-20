import { KlasifikasiUsiaTypes } from '@/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BabyIcon } from 'lucide-react';

export default function TableKlasifikasiUsia({ data }: { data: KlasifikasiUsiaTypes[] }) {
    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead colSpan={7}>
                        <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-semibold text-white">
                            <BabyIcon className="h-4 w-4" />
                            Klasifikasi Berdasarkan Usia
                        </h3>
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="w-10">No.</TableHead>
                    <TableHead className="cursor-pointer">Usia</TableHead>
                    <TableHead className="cursor-pointer">sayuran</TableHead>
                    <TableHead className="cursor-pointer">Porsi</TableHead>
                    <TableHead className="cursor-pointer">Tekstur</TableHead>
                    <TableHead className="cursor-pointer">Frekuensi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.length > 0 ? (
                    data.map((item: KlasifikasiUsiaTypes, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.min_usia + '-' + item.max_usia} tahun</TableCell>
                            <TableCell>{item.sayuran}</TableCell>
                            <TableCell>{item.porsi}</TableCell>
                            <TableCell>{item.tekstur}</TableCell>
                            <TableCell>{item.frekuensi}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                            Tidak ada data
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
