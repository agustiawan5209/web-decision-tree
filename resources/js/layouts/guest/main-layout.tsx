import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart2, Home, Info, Leaf, Menu, User, X } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
export default function MainLayout({ children }: PropsWithChildren<{}>) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
        {
            name: 'Klasifikasi',
            path: '/classification',
            icon: <BarChart2 className="h-4 w-4" />,
        },
        {
            name: 'Data Sayur',
            path: '/vegetable-data',
            icon: <Leaf className="h-4 w-4" />,
        },
        { name: 'Tentang', path: '/about', icon: <Info className="h-4 w-4" /> },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen bg-white to-blue-50">
            {/* Header */}
            <motion.nav
                className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white"
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="flex items-center">
                                <Leaf className="h-8 w-8 text-green-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">NutriVege</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        href={'#' + item.path}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                            isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    >
                                        <span className="mr-1.5">{item.icon}</span>
                                        {item.name}
                                        {isActive && (
                                            <motion.div className="absolute bottom-0 left-0 h-0.5 w-full bg-green-600" layoutId="navbar-indicator" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Profile */}
                        <div className="hidden items-center md:flex">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors duration-200 hover:bg-green-200">
                                <User className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none focus:ring-inset"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <motion.div
                    className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: isMenuOpen ? 1 : 0,
                        height: isMenuOpen ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="space-y-1 bg-white px-2 pt-2 pb-3 shadow-lg sm:px-3">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <a
                                    key={item.name}
                                    href={'#' + item.path}
                                    className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                                        isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </a>
                            );
                        })}
                        <div className="border-t border-gray-200 pt-4 pb-3">
                            <div className="flex items-center px-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                        <User className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">User Profile</div>
                                    <div className="text-sm font-medium text-gray-500">user@example.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.nav>

            {/* Content */}
            <main className="min-h-screen overflow-auto py-6 md:py-12">{children}</main>
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
