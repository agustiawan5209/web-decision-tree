import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type PropsWithChildren } from 'react';
interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-zinc-100 p-10 text-white lg:flex dark:border-r">
                {/* <div className="absolute inset-0 bg-zinc-900" /> */}
                <div className="container mx-auto text-center">
                    <motion.div
                        className="flex flex-col items-center gap-12 md:flex-row"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="flex-1" variants={itemVariants}>
                            <h1 className="mb-6 text-center text-xl font-bold text-primary md:text-3xl">
                                Rekomendasi Jenis Sayuran Berdasarkan Nutrisi untuk Anak
                            </h1>
                            <p className="mb-8 text-justify text-base text-muted-foreground">
                                Sistem cerdas menggunakan Algoritma Decision Tree untuk membantu orang tua dan guru mengklasifikasikan sayuran
                                berdasarkan nilai nutrisi untuk anak-anak.
                            </p>
                        </motion.div>

                        <motion.div className="flex flex-1 justify-center" variants={itemVariants}>
                            <img
                                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"
                                alt="Vegetables for children"
                                className="h-auto max-w-full rounded-lg shadow-xl"
                            />
                        </motion.div>
                    </motion.div>
                </div>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg text-destructive">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-neutral-400">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
