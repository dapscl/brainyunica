import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import type { CalendarContent } from './CalendarBrainy';

interface ContentStatsProps {
  content: CalendarContent[];
}

export const ContentStats = ({ content }: ContentStatsProps) => {
  const stats = {
    total: content.length,
    published: content.filter(c => c.status === 'published').length,
    scheduled: content.filter(c => c.status === 'scheduled').length,
    draft: content.filter(c => c.status === 'draft').length,
    failed: content.filter(c => c.status === 'failed').length,
    promoted: content.filter(c => c.promoted).length
  };

  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      icon: Calendar,
      color: 'text-electric-cyan',
      bgColor: 'bg-electric-cyan/20'
    },
    {
      label: 'Publicados',
      value: stats.published,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      label: 'Programados',
      value: stats.scheduled,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Borradores',
      value: stats.draft,
      icon: Target,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      label: 'Promocionados',
      value: stats.promoted,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  if (stats.failed > 0) {
    statCards.push({
      label: 'Fallidos',
      value: stats.failed,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card/30 backdrop-blur-sm border-border/30 hover:border-electric-cyan/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
