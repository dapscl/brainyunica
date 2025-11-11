import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  delay?: number;
}

export const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'lg',
  className = '',
  delay = 0 
}: AnimatedButtonProps) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan',
    secondary: 'bg-gradient-to-r from-purple-accent to-purple-accent/90 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-purple',
    outline: 'border-electric-cyan/30 bg-background/50 backdrop-blur-sm text-electric-cyan hover:bg-electric-cyan/10 hover:border-electric-cyan/50 uppercase tracking-wide'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Button 
        size={size}
        onClick={onClick}
        variant={variant === 'outline' ? 'outline' : 'default'}
        className={`gap-2 transition-all duration-300 ${variantClasses[variant]} ${className}`}
      >
        {children}
      </Button>
    </motion.div>
  );
};
