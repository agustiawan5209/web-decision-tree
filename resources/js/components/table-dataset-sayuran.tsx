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
                            Rekomendasi Jenis Sayuran
                        </h3>
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="w-10">No.</TableHead>
                    <TableHead>Nama Sayuran</TableHead>
                    <TableHead>Nutrisi</TableHead>
                    <TableHead>Manfaat</TableHead>
                    <TableHead>Status IMT</TableHead>
                    <TableHead>Gejala</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.length > 0 &&
                    data.map((item: DatasetSayuranTypes, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell> {item.nama_sayuran} </TableCell>
                            <TableCell className="text-xs"> {item.nutrisi} </TableCell>
                            <TableCell className="text-xs"> {item.manfaat} </TableCell>
                            <TableCell className="text-xs"> {item.status} </TableCell>
                            <TableCell className="text-xs"> {item.gejala} </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
}
