import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Users, Clock, Zap, TrendingUp } from 'lucide-react';

interface MetricProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  color: string;
  delay: number;
  isPercentage?: boolean;
}

const AnimatedMetric = ({ icon: Icon, value, suffix, prefix = '', label, color, delay, isPercentage = false }: MetricProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.min(Math.floor(increment * currentStep), value));
      } else {
        setCount(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="text-center space-y-4 p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-electric-cyan/50 transition-all duration-500 hover:shadow-glow-cyan">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="w-8 h-8 text-background" />
          </div>
        </div>

        {/* Counter */}
        <div className="space-y-1">
          <div className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-electric-cyan to-purple-accent bg-clip-text text-transparent">
              {prefix}
              {isPercentage ? count : formatNumber(count)}
              {suffix}
            </span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            {label}
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={isInView ? { width: '100%' } : { width: '0%' }}
            transition={{ duration: 2, delay }}
            className={`h-full bg-gradient-to-r ${color}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const AnimatedMetrics = () => {
  const { t } = useTranslation();

  const metrics: MetricProps[] = [
    {
      icon: Users,
      value: 10000,
      suffix: '+',
      label: t('showcase.metrics.leadsGenerated'),
      color: 'from-electric-cyan to-blue-500',
      delay: 0,
    },
    {
      icon: Clock,
      value: 500,
      suffix: '+',
      label: t('showcase.metrics.hoursSaved'),
      color: 'from-purple-500 to-purple-accent',
      delay: 0.1,
    },
    {
      icon: Zap,
      value: 95,
      suffix: '%',
      label: t('showcase.metrics.automation'),
      color: 'from-green-500 to-emerald-500',
      delay: 0.2,
      isPercentage: true,
    },
    {
      icon: TrendingUp,
      value: 250,
      suffix: '%',
      prefix: '+',
      label: t('showcase.metrics.avgRoi'),
      color: 'from-electric-cyan to-purple-accent',
      delay: 0.3,
      isPercentage: true,
    },
  ];

  return (
    <section className="container mx-auto px-4 py-32">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tight">
            {t('showcase.metrics.title')} <span className="text-electric-cyan">{t('showcase.metrics.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            {t('showcase.metrics.subtitle')}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <AnimatedMetric key={index} {...metric} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-lg text-muted-foreground italic font-light">
            "{t('showcase.metrics.footer')}"
          </p>
        </motion.div>
      </div>
    </section>
  );
};