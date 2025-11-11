import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const PlatformComparison = () => {
  const { t } = useTranslation();
  
  const features = [
    'social', 'chat', 'ads', 'projects', 'analytics', 'content', 'leads', 'trends'
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <Badge variant="outline" className="mb-4 px-4 py-2 bg-card/30 backdrop-blur-sm border-electric-cyan/30">
          {t('showcase.platformComparison.badge')}
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {t('showcase.platformComparison.title')}
        </h2>
        <p className="text-xl text-muted-foreground">
          {t('showcase.platformComparison.subtitle')}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid lg:grid-cols-3 gap-4 mb-8"
      >
        <Card className="lg:col-span-1 bg-card/30 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-center text-foreground">{t('showcase.platformComparison.functionality')}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="lg:col-span-1 bg-card/20 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 text-muted-foreground">
              <X className="w-5 h-5 text-destructive" />
              {t('showcase.platformComparison.traditional')}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="lg:col-span-1 bg-electric-cyan/5 backdrop-blur-sm border-electric-cyan/30 hover:shadow-glow-cyan transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 text-electric-cyan">
              <Check className="w-5 h-5" />
              {t('showcase.platformComparison.brainy')}
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="space-y-3">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="grid lg:grid-cols-3 gap-4 items-start"
          >
            <Card className="h-full bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/40 transition-all duration-300">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 text-foreground">{t(`showcase.platformComparison.features.${feature}.category`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`showcase.platformComparison.features.${feature}.description`)}</p>
              </CardContent>
            </Card>
            
            <Card className="h-full bg-card/20 backdrop-blur-sm border-border/30">
              <CardContent className="p-4 flex items-center gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{t(`showcase.platformComparison.features.${feature}.traditional`)}</p>
              </CardContent>
            </Card>

            <Card className="h-full bg-electric-cyan/5 backdrop-blur-sm border-electric-cyan/30 hover:shadow-glow-cyan transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-electric-cyan flex-shrink-0" />
                <p className="text-sm font-medium text-foreground">{t(`showcase.platformComparison.features.${feature}.brainy`)}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-electric-cyan/10 via-purple-accent/10 to-deep-blue/20 backdrop-blur-sm border-electric-cyan/30 mt-12 hover:shadow-glow-cyan transition-all duration-500">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3 text-foreground">{t('showcase.platformComparison.results.title')}</h3>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-4xl font-bold text-electric-cyan mb-2">-70%</p>
                <p className="text-sm text-muted-foreground">{t('showcase.platformComparison.results.cost')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p className="text-4xl font-bold text-electric-cyan mb-2">5x</p>
                <p className="text-sm text-muted-foreground">{t('showcase.platformComparison.results.speed')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <p className="text-4xl font-bold text-electric-cyan mb-2">100%</p>
                <p className="text-sm text-muted-foreground">{t('showcase.platformComparison.results.visibility')}</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
