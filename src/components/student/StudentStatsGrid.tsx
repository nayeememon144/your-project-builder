import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

type StatItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

interface StudentStatsGridProps {
  stats: StatItem[];
}

export const StudentStatsGrid = ({ stats }: StudentStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
