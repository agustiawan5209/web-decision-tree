import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircleIcon, ArrowDownIcon, ArrowUpIcon, CheckCircleIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit: string;
    status: 'normal' | 'warning';
    trend: 'up' | 'down' | 'stable';
    trendValue?: string;
}

const KPICard = ({ title = 'Metric', value = 0, unit = '', status = 'normal', trend = 'stable', trendValue = '0%' }: MetricCardProps) => {
    return (
        <Card className="bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="mb-1 text-sm text-muted-foreground">{title}</p>
                        <div className="flex items-baseline">
                            <h3 className="text-2xl font-semibold">{value}</h3>
                            <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
                        </div>
                        {/* <div className="mt-2 flex items-center">
                            {trend === 'up' && <ArrowUpIcon className="mr-1 h-3 w-3 text-emerald-500" />}
                            {trend === 'down' && <ArrowDownIcon className="mr-1 h-3 w-3 text-rose-500" />}
                            <span className="text-xs text-muted-foreground">{trendValue}</span>
                        </div> */}
                    </div>
                    <Badge variant={status === 'normal' ? 'secondary' : 'destructive'} className="ml-auto">
                        {status === 'normal' ? <CheckCircleIcon className="mr-1 h-3 w-3" /> : <AlertCircleIcon className="mr-1 h-3 w-3" />}
                        {status === 'normal' ? 'Normal' : 'Warning'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default KPICard
