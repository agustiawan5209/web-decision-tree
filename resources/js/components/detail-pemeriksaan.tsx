import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface DetailPemeriksaanProps {
    detail: {
        attribut: {
            nama: string;
        };
        nilai: number | string;
    }[];
    pemeriksaan: {
        id: string;
        tgl_pemeriksaan: string;
        label: string;
        detailpemeriksaan: any;
        alasan: string;
    };
}

function DetailPemeriksaan({ detail, pemeriksaan }: DetailPemeriksaanProps) {
    return (
        <section className="border-x">
            <h3 className="bg-blue-100 p-4 text-left text-lg font-semibold text-foreground md:text-xl dark:bg-gray-800">Data Pemeriksaan</h3>
            <Table className="w-full">
                <TableBody>
                    {detail
                        .filter((attr) => !['jenis kelamin'].includes(attr.attribut.nama.toLowerCase()))
                        .map((item, index) => (
                            <TableRow key={index} className="border-b py-1">
                                <TableCell className="w-1/3 font-normal text-gray-600 dark:text-gray-100">{item.attribut.nama}:</TableCell>
                                <TableCell>{item.nilai}</TableCell>
                            </TableRow>
                        ))}
                    <TableRow className="border-b py-1">
                        <TableCell className="w-1/3 font-normal text-gray-600 dark:text-gray-100">Alasan:</TableCell>
                        <TableCell>
                            <p dangerouslySetInnerHTML={{ __html: pemeriksaan.alasan }} className="max-w-max whitespace-normal" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </section>
    );
}

export default DetailPemeriksaan;
