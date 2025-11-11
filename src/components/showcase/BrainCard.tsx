import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface BrainCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  color: 'cyan' | 'purple' | 'blue' | 'green';
  delay?: number;
}

const colorClasses = {
  cyan: 'from-electric-cyan/20 to-electric-cyan/5 border-electric-cyan/30',
  purple: 'from-purple-accent/20 to-purple-accent/5 border-purple-accent/30',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  green: 'from-green-500/20 to-green-500/5 border-green-500/30',
};

const iconColorClasses = {
  cyan: 'text-electric-cyan',
  purple: 'text-purple-accent',
  blue: 'text-blue-500',
  green: 'text-green-500',
};

const glowClasses = {
  cyan: 'group-hover:shadow-glow-cyan',
  purple: 'group-hover:shadow-[0_0_40px_hsl(280_70%_60%_/_0.4)]',
  blue: 'group-hover:shadow-[0_0_40px_hsl(220_80%_60%_/_0.4)]',
  green: 'group-hover:shadow-[0_0_40px_hsl(140_70%_50%_/_0.4)]',
};

export const BrainCard = ({ icon: Icon, title, description, features, color, delay = 0 }: BrainCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        className={`group relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border transition-all duration-500 hover:scale-[1.02] ${glowClasses[color]}`}
      >
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start gap-6">
            <div className={`flex-shrink-0 p-4 rounded-xl bg-background/50 ${iconColorClasses[color]} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 tracking-tight text-foreground">{title}</h3>
              {description && <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>}
              
              {features && features.length > 0 && (
                <ul className="space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-electric-cyan mt-2" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} blur-xl`}></div>
        </div>
      </Card>
    </motion.div>
  );
};