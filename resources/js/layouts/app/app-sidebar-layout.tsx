import { BarChart3 } from 'lucide-react';
// Import the default export from each file
import { Breadcrumbs } from '@/components/breadcrumbs';
import Sidebar from '@/components/dashboard/Sidebar';
import { Toast } from '@/components/ui/toast';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState, type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const navigationItems = [{ title: 'Dashboard', href: '/dashboard', icon: BarChart3 }];

    const page = usePage<SharedData>();
    const { flash } = page.props;

    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({
        title: '',
        description: '',
        variant: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        if (flash.success || flash.error) {
            // If there's a flash message, open the toast
            setOpenToast(true);
        }
        if (flash.success) {
            // If there's a success message, set the toast message
            setToastMessage({
                title: 'Success',
                description: flash.success,
                variant: 'success',
            });
        }
        if (flash.error) {
            // If there's an error message, set the toast message
            setToastMessage({
                title: 'Error',
                description: flash.error,
                variant: 'error',
            });
        }
    }, [flash]);
    const closeToast = () => {
        // This function is called when the toast is closed
        setOpenToast(false);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Toast
                open={openToast}
                onOpenChange={setOpenToast}
                title={toastMessage.title}
                description={toastMessage.description}
                duration={5000}
                variant={toastMessage.variant}
            />

            {/* Sidebar */}
            <Sidebar collapsed={false} />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-sidebar-border/50 bg-background px-4 md:px-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </header>
                <section className="max-w-full flex-1 overflow-auto p-4 md:p-6">{children}</section>
            </main>
        </div>
    );
}
