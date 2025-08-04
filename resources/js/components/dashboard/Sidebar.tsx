import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart2Icon, ChevronLeft, ChevronRight, Clock8, FolderClockIcon, GalleryHorizontal, Home, LeafyGreen, SproutIcon, UserCog, Users2, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    handleSidebarIsMobile?: () => void;
}

const Sidebar = ({ className, collapsed = false, onToggleCollapse, handleSidebarIsMobile }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const activeSection = usePage().url.split('/').pop() || 'Dashboard';
    const { auth } = usePage<SharedData>().props;
    // console.log('Active Section:', activeSection);

    const handleToggleCollapse = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggleCollapse) {
            onToggleCollapse();
        }
    };

    const navItems = [
        { name: 'Dashboard', icon: <Home size={20} />, href: route('dashboard'), active: 'dashboard' },
        { name: 'Kriteria', icon: <BarChart2Icon size={20} />, href: route('admin.kriteria.index'), active: 'kriterias' },
        { name: 'Data Pengguna', icon: <Users2 size={20} />, href: route('admin.orangtua.index'), active: 'orangtua' },
        { name: 'Data Anak', icon: <UserCog size={20} />, href: route('balita.index'), active: 'balita' },
        { name: 'Training Data Nutrisi', icon: <FolderClockIcon size={20} />, href: route('admin.dataset.index'), active: 'dataset' },
        { name: 'Decision Tree', icon: <GalleryHorizontal size={20} />, href: route('DecisionTree.index'), active: 'decision-tree' },
        { name: 'Pemeriksaan', icon: <Clock8 size={20} />, href: route('pemeriksaan.index'), active: 'pemeriksaan' },
        { name: 'Riwayat Klasifikasi', icon: <FolderClockIcon size={20} />, href: route('admin.riwayat.index'), active: 'riwayat-forest' },
    ];

    if(auth.role == 'super_admin'){
        navItems.push({ name: 'Label', icon: <BarChart2Icon size={20} />, href: route('admin.label.index'), active: 'label' })
        navItems.push({ name: 'Jenis Sayuran', icon: <LeafyGreen size={20} />, href: route('admin.jenisTanaman.index'), active: 'jenis-tanaman' })
    }

    const isMobile = useIsMobile();
    return (
        <div className={cn('flex h-full flex-col border-r bg-sidebar transition-all duration-300', isCollapsed ? 'w-16' : 'w-64', className)}>
            {/* Logo and collapse button */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <SproutIcon className="text-primary" size={24} />
                    {!isCollapsed && <span className="text-lg font-semibold">HydroMonitor</span>}
                </div>
                {!isMobile ? (
                    <Button variant="ghost" size="icon" onClick={handleToggleCollapse} className="h-8 w-8">
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" onClick={handleSidebarIsMobile} className="h-8 w-8">
                        <X size={16} />
                    </Button>
                )}
            </div>

            <Separator />

            {/* Navigation */}
            <ScrollArea className="flex-1">
                <nav className="px-2 py-4">
                    <TooltipProvider delayDuration={0}>
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn('flex items-center', item.active == activeSection ? 'text-primary' : 'text-white')}
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={item.active == activeSection ? 'outline' : 'ghost'}
                                                    className={cn('w-full justify-start', isCollapsed ? 'px-2' : 'px-3')}
                                                >
                                                    <span className="flex items-center">
                                                        <span className={cn(item.active == activeSection ? 'text-primary' : 'text-white')}>
                                                            {item.icon}
                                                        </span>
                                                        {!isCollapsed && <span className="ml-3">{item.name}</span>}
                                                    </span>
                                                </Button>
                                            </TooltipTrigger>
                                            {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                                        </Tooltip>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </TooltipProvider>
                </nav>
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
