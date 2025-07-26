import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { BarChart2Icon, ChevronLeft, ChevronRight, FolderClockIcon, GalleryHorizontal, Home, Leaf, LeafyGreen } from 'lucide-react';
import { useState } from 'react';
import { NavUser } from '../nav-user';

interface SidebarProps {
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

const Sidebar = ({ className, collapsed = false, onToggleCollapse }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const activeSection = usePage().url.split('/').pop() || 'Dashboard';
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
        { name: 'Label', icon: <BarChart2Icon size={20} />, href: route('admin.label.index'), active: 'label' },
        { name: 'jenis Tanaman', icon: <LeafyGreen size={20} />, href: route('admin.jenisTanaman.index'), active: 'jenis-tanaman' },
        { name: 'Training Tanaman', icon: <FolderClockIcon size={20} />, href: route('admin.dataset.index'), active: 'dataset' },
        { name: 'Random Forest', icon: <GalleryHorizontal size={20} />, href: route('randomForest.index'), active: 'random-forest' },
        { name: 'Riwayat Klasifikasi', icon: <FolderClockIcon size={20} />, href: route('admin.riwayat.index'), active: 'riwayat-forest' },
    ];

    return (
        <div className={cn('flex h-full flex-col border-r bg-background transition-all duration-300', isCollapsed ? 'w-16' : 'w-64', className)}>
            {/* Logo and collapse button */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <Leaf className="text-primary" size={24} />
                    {!isCollapsed && <span className="text-lg font-semibold">HydroMonitor</span>}
                </div>
                <Button variant="ghost" size="icon" onClick={handleToggleCollapse} className="h-8 w-8">
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </Button>
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
                                        className={cn('flex items-center', item.active == activeSection ? 'text-primary' : 'text-foreground')}
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={item.active == activeSection ? 'secondary' : 'ghost'}
                                                    className={cn('w-full justify-start', isCollapsed ? 'px-2' : 'px-3')}
                                                >
                                                    <span className="flex items-center">
                                                        <span className={cn(item.active == activeSection ? 'text-primary' : 'text-foreground')}>
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

            {/* Footer */}
            <div className="static bottom-0 p-4">
                <NavUser />
            </div>
        </div>
    );
};

export default Sidebar;
