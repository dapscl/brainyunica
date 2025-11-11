import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface GlowCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: 'cyan' | 'purple' | 'green' | 'blue';
  glowColor?: 'cyan' | 'purple' | 'green' | 'blue';
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const GlowCard = ({ 
  title, 
  description, 
  icon: Icon, 
  iconColor = 'cyan',
  glowColor = 'cyan',
  children, 
  delay = 0,
  className = ''
}: GlowCardProps) => {
  const glowClasses = {
    cyan: 'border-electric-cyan/20 shadow-[0_0_60px_hsl(189_94%_63%_/_0.2)] hover:shadow-[0_0_80px_hsl(189_94%_63%_/_0.3)]',
    purple: 'border-purple-accent/20 shadow-[0_0_60px_hsl(280_100%_70%_/_0.2)] hover:shadow-[0_0_80px_hsl(280_100%_70%_/_0.3)]',
    green: 'border-green-500/20 shadow-[0_0_60px_hsl(140_70%_50%_/_0.2)] hover:shadow-[0_0_80px_hsl(140_70%_50%_/_0.3)]',
    blue: 'border-deep-blue/20 shadow-[0_0_60px_hsl(220_90%_56%_/_0.2)] hover:shadow-[0_0_80px_hsl(220_90%_56%_/_0.3)]'
  };

  const iconColorClasses = {
    cyan: 'bg-electric-cyan text-background',
    purple: 'bg-purple-accent text-background',
    green: 'bg-green-500 text-background',
    blue: 'bg-deep-blue text-background'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <Card className={`relative bg-card/30 backdrop-blur-sm border transition-all duration-500 ${glowClasses[glowColor]}`}>
        {Icon && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className={`p-4 rounded-2xl shadow-glow ${iconColorClasses[iconColor]}`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
        )}
        
        {(title || description) && (
          <CardHeader className={Icon ? 'pt-12' : ''}>
            {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}
            {description && <CardDescription className="text-base font-light">{description}</CardDescription>}
          </CardHeader>
        )}
        
        <CardContent className={!title && !description && Icon ? 'pt-12' : ''}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};
