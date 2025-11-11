import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingTier {
  name: string;
  basePrice: string;
  percentage: string;
  features: string[];
  prefix?: string | null;
  isEnterprise?: boolean;
}

interface PricingComparisonProps {
  tiers: PricingTier[];
}

export const PricingComparison = ({ tiers }: PricingComparisonProps) => {
  const { t } = useTranslation();
  const [selectedTiers, setSelectedTiers] = useState<number[]>([]);

  const toggleTier = (index: number) => {
    setSelectedTiers(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), index];
      }
      return [...prev, index];
    });
  };

  const getAllFeatures = () => {
    const allFeatures = new Set<string>();
    selectedTiers.forEach(tierIndex => {
      tiers[tierIndex].features.forEach(feature => allFeatures.add(feature));
    });
    return Array.from(allFeatures);
  };

  const hasFeature = (tierIndex: number, feature: string) => {
    return tiers[tierIndex].features.includes(feature);
  };

  return (
    <div className="space-y-8">
      {/* Tier Selection */}
      <Card className="border-electric-cyan/20 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center uppercase tracking-tight">
            {t('showcase.pricing.comparison.title', 'Comparar Planes')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('showcase.pricing.comparison.subtitle', 'Selecciona hasta 3 planes para comparar sus características')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedTiers.includes(index)
                    ? 'border-electric-cyan bg-electric-cyan/10'
                    : 'border-border/50 hover:border-electric-cyan/50'
                }`}
                onClick={() => toggleTier(index)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedTiers.includes(index)}
                    onCheckedChange={() => toggleTier(index)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{tier.name}</h3>
                    <p className="text-sm text-electric-cyan font-semibold">{tier.basePrice}</p>
                    <p className="text-xs text-muted-foreground">+ {tier.percentage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedTiers.length > 0 && (
            <div className="mt-4 text-center">
              <Badge variant="outline" className="bg-electric-cyan/10 border-electric-cyan/30">
                {selectedTiers.length} {t('showcase.pricing.comparison.selected', 'planes seleccionados')}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <AnimatePresence>
        {selectedTiers.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-electric-cyan/20 bg-card/30 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-tight">
                  {t('showcase.pricing.comparison.details', 'Comparación Detallada')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="p-4 text-left font-bold text-muted-foreground sticky left-0 bg-card/50 backdrop-blur-sm">
                          {t('showcase.pricing.comparison.feature', 'Característica')}
                        </th>
                        {selectedTiers.map(tierIndex => (
                          <th key={tierIndex} className="p-4 text-center font-bold min-w-[200px]">
                            <div className="space-y-1">
                              <div className="text-foreground">{tiers[tierIndex].name}</div>
                              <div className="text-sm text-electric-cyan font-semibold">{tiers[tierIndex].basePrice}</div>
                              <div className="text-xs text-muted-foreground">+ {tiers[tierIndex].percentage}</div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Price Row */}
                      <tr className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="p-4 font-medium sticky left-0 bg-card/50 backdrop-blur-sm">
                          {t('showcase.pricing.comparison.basePrice', 'Precio Base')}
                        </td>
                        {selectedTiers.map(tierIndex => (
                          <td key={tierIndex} className="p-4 text-center">
                            <span className="font-bold text-electric-cyan">{tiers[tierIndex].basePrice}</span>
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="p-4 font-medium sticky left-0 bg-card/50 backdrop-blur-sm">
                          {t('showcase.pricing.comparison.mediaPercentage', '% de Medios')}
                        </td>
                        {selectedTiers.map(tierIndex => (
                          <td key={tierIndex} className="p-4 text-center">
                            <span className="font-bold text-purple-accent">{tiers[tierIndex].percentage}</span>
                          </td>
                        ))}
                      </tr>

                      {/* Features Rows */}
                      {getAllFeatures().map((feature, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-4 text-sm sticky left-0 bg-card/50 backdrop-blur-sm">
                            {feature}
                          </td>
                          {selectedTiers.map(tierIndex => (
                            <td key={tierIndex} className="p-4 text-center">
                              {tiers[tierIndex].isEnterprise ? (
                                <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />
                              ) : hasFeature(tierIndex, feature) ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTiers.length === 1 && (
        <div className="text-center p-8 text-muted-foreground">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('showcase.pricing.comparison.selectMore', 'Selecciona al menos 2 planes para comparar')}</p>
        </div>
      )}

      {selectedTiers.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('showcase.pricing.comparison.selectPlans', 'Selecciona planes arriba para comenzar la comparación')}</p>
        </div>
      )}
    </div>
  );
};
