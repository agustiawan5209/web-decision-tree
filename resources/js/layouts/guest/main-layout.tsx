import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Leaf } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function MainLayout({ children }: PropsWithChildren<{}>) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-green-100 bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div className="flex items-center space-x-2">
                        <Leaf className="h-8 w-8 text-green-600" />
                        <span className="text-xl font-bold text-gray-800">HydroAI</span>
                    </div>
                    <nav className="hidden space-x-6 md:flex">
                        <a href="#features" className="text-gray-600 transition-colors hover:text-green-600">
                            Fitur
                        </a>
                        <a href="#how-it-works" className="text-gray-600 transition-colors hover:text-green-600">
                            Cara Kerja
                        </a>
                    </nav>
                    {auth.user ? (
                        <Link method="post" as='button'  href={route('logout')} className="bg-green-600 hover:bg-green-700 h-10 text-white px-6 has-[>svg]:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
                            <span >Logout</span>
                        </Link>
                    ) : (
                        <Link href={route('login')}>
                            <Button className="bg-green-600 hover:bg-green-700">Masuk</Button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className='min-h-screen overflow-auto py-6 md:py-12'>{children}</main>
            {/* Footer */}
            <footer className="bg-gray-900 px-4 py-12 text-white">
                <div className="container mx-auto">
                    <div className="grid gap-8 md:grid-cols-2">

                            <div className="mb-4 flex items-center space-x-2">
                                <Leaf className="h-8 w-8 text-green-400" />
                                <span className="text-xl font-bold">HydroAI</span>
                            </div>
                        <p className="text-gray-400">Sistem pendukung keputusan berbasis AI untuk nutrisi tanaman hidroponik yang optimal.</p>
                        {/* <div>
                            <h3 className="mb-4 font-semibold">Produk</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Dashboard
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Analytics
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Mobile App
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Dukungan</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Dokumentasi
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Tutorial
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Kontak
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Perusahaan</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Tentang Kami
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Karir
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-white">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 HydroAI. Semua hak dilindungi undang-undang.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
