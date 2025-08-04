interface DetailPemeriksaanProps {
    detail: {
        kriteria: {
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
        <section className="overflow-hidden rounded-lg border-x border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Data Pemeriksaan</h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {detail
                    .filter((attr) => !['jenis kelamin'].includes(attr.kriteria.nama.toLowerCase()))
                    .map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 px-4 py-3">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.kriteria.nama}</div>
                            <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100">{item.nilai}</div>
                        </div>
                    ))}

                <div className="grid grid-cols-3 gap-4 px-4 py-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Alasan</div>
                    <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pemeriksaan.alasan }} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DetailPemeriksaan;
