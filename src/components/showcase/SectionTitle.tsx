import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  subtitleBold?: string;
  align?: 'left' | 'center' | 'right';
  icon?: LucideIcon;
  iconColor?: string;
}

export const SectionTitle = ({ 
  title, 
  highlight, 
  subtitle, 
  subtitleBold,
  align = 'center',
  icon: Icon,
  iconColor = 'electric-cyan'
}: SectionTitleProps) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const iconColorClass = iconColor === 'purple' ? 'text-purple-accent' : 
                        iconColor === 'green' ? 'text-green-500' :
                        iconColor === 'cyan' ? 'text-electric-cyan' : 
                        `text-${iconColor}`;

  return (
    <div className={`max-w-4xl ${align === 'center' ? 'mx-auto' : ''} ${alignClass}`}>
      {Icon && (
        <motion.div
          className={`flex ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'} mb-6`}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={`relative`}>
            <Icon className={`w-16 h-16 ${iconColorClass} animate-pulse`} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-0 border-4 border-${iconColor}/20 border-t-${iconColor} rounded-full`}
            />
          </div>
        </motion.div>
      )}
      
      <motion.h2 
        className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-foreground">{title}</span>
        {highlight && (
          <>
            {' '}
            <span className="text-electric-cyan">{highlight}</span>
          </>
        )}
      </motion.h2>
      
      {(subtitle || subtitleBold) && (
        <motion.div
          className="text-xl text-muted-foreground font-light leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
          {subtitleBold && (
            <>
              <br />
              <span className="text-foreground font-medium">{subtitleBold}</span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};
