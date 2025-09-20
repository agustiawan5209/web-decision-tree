import { DatasetSayuranTypes } from '@/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Utensils } from 'lucide-react';

export default function TableDatasetSayuran({ data }: { data: DatasetSayuranTypes[] }) {
    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead colSpan={7}>
                        <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-semibold text-white">
                            <Utensils className="h-4 w-4" />
                            Rekomendasi Jenis Sayuran Berdasarkan Gejala
                        </h3>
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="w-10">No.</TableHead>
                    <TableHead>Nama Sayuran</TableHead>
                    <TableHead>Nutrisi</TableHead>
                    <TableHead>Manfaat</TableHead>
                    <TableHead>Porsi per Saji (Usia 1 -3 Tahun)</TableHead>
                    <TableHead>Porsi per Hari (Usia 4 -6 Tahun)</TableHead>
                    <TableHead>Cara Penyajian</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.length > 0 ? (
                    data.map((item: DatasetSayuranTypes, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell> {item.nama_sayuran} </TableCell>
                            <TableCell className="text-xs"> {item.nutrisi} </TableCell>
                            <TableCell className="text-xs"> {item.manfaat} </TableCell>
                            <TableCell> {item.porsi} </TableCell>
                            <TableCell> {item.porsi_hari} </TableCell>
                            <TableCell> {item.penyajian} </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                            Tidak ada data
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
