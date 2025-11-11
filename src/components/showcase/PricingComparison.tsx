import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
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

  // Define comparison categories with value extraction logic
  const comparisonCategories = [
    {
      key: 'users',
      label: t('showcase.pricing.comparison.categories.users', 'Users'),
      getValue: (tier: PricingTier) => {
        const userFeature = tier.features.find(f => 
          f.toLowerCase().includes('usuario') || 
          f.toLowerCase().includes('user')
        );
        if (!userFeature) return '-';
        const match = userFeature.match(/(\d+)/);
        return match ? match[1] : '-';
      }
    },
    {
      key: 'brands',
      label: t('showcase.pricing.comparison.categories.brands', 'Brands'),
      getValue: (tier: PricingTier) => {
        const brandFeature = tier.features.find(f => 
          f.toLowerCase().includes('marca') || 
          f.toLowerCase().includes('brand')
        );
        if (!brandFeature) return '-';
        const match = brandFeature.match(/(\d+)/);
        return match ? match[1] : '1';
      }
    },
    {
      key: 'posts',
      label: t('showcase.pricing.comparison.categories.posts', 'Posts/month'),
      getValue: (tier: PricingTier) => {
        const postFeature = tier.features.find(f => 
          f.toLowerCase().includes('publicacion') || 
          f.toLowerCase().includes('post')
        );
        if (!postFeature) return '-';
        const match = postFeature.match(/(\d+(?:[,\.]\d+)?)/);
        return match ? match[1] : '-';
      }
    },
    {
      key: 'storage',
      label: t('showcase.pricing.comparison.categories.storage', 'Storage'),
      getValue: (tier: PricingTier) => {
        const storageFeature = tier.features.find(f => 
          f.toLowerCase().includes('almacenamiento') || 
          f.toLowerCase().includes('storage')
        );
        if (!storageFeature) return '-';
        const match = storageFeature.match(/(\d+\s*[GT]B)/i);
        return match ? match[1] : '-';
      }
    },
    {
      key: 'whatsapp',
      label: t('showcase.pricing.comparison.categories.whatsapp', 'WhatsApp Manager'),
      getValue: () => '✓' // Todos los planes incluyen WhatsApp Manager
    },
    {
      key: 'brainies',
      label: t('showcase.pricing.comparison.categories.brainies', '5 Brainies'),
      getValue: () => '✓' // Todos los planes incluyen los 5 Brainies
    },
    {
      key: 'ai',
      label: t('showcase.pricing.comparison.categories.ai', 'AI Features'),
      getValue: (tier: PricingTier) => {
        const aiFeature = tier.features.find(f => 
          f.toLowerCase().includes('ia ') || 
          f.toLowerCase().includes('ia:') ||
          f.toLowerCase().includes('ai ')
        );
        if (!aiFeature) return t('showcase.pricing.comparison.values.standard', 'Standard');
        if (aiFeature.toLowerCase().includes('ilimitada') || aiFeature.toLowerCase().includes('unlimited')) {
          return t('showcase.pricing.comparison.values.unlimited', 'Unlimited');
        }
        if (aiFeature.toLowerCase().includes('avanzada') || aiFeature.toLowerCase().includes('advanced')) {
          return t('showcase.pricing.comparison.values.advanced', 'Advanced');
        }
        return t('showcase.pricing.comparison.values.standard', 'Standard');
      }
    },
    {
      key: 'integrations',
      label: t('showcase.pricing.comparison.categories.integrations', 'Platform Integrations'),
      getValue: (tier: PricingTier) => {
        const intFeature = tier.features.find(f => 
          f.toLowerCase().includes('integración') || 
          f.toLowerCase().includes('integration') ||
          f.toLowerCase().includes('meta')
        );
        if (!intFeature) return 'Meta, Google';
        if (intFeature.includes('TikTok') || intFeature.includes('LinkedIn')) {
          return 'Meta, Google, TikTok, LinkedIn';
        }
        return 'Meta, Google';
      }
    },
    {
      key: 'workflows',
      label: t('showcase.pricing.comparison.categories.workflows', 'Approval Workflows'),
      getValue: () => '✓' // Todos los planes incluyen workflows de aprobación
    },
    {
      key: 'automation',
      label: t('showcase.pricing.comparison.categories.automation', 'Automation (n8n/Zapier)'),
      getValue: (tier: PricingTier) => {
        const autoFeature = tier.features.find(f => 
          f.toLowerCase().includes('automatización total') ||
          f.toLowerCase().includes('full automation') ||
          f.toLowerCase().includes('n8n') ||
          f.toLowerCase().includes('zapier')
        );
        return autoFeature ? '✓' : '-';
      }
    },
    {
      key: 'support',
      label: t('showcase.pricing.comparison.categories.support', 'Support'),
      getValue: (tier: PricingTier) => {
        const supportFeature = tier.features.find(f => 
          f.toLowerCase().includes('soporte prioritario') ||
          f.toLowerCase().includes('priority support')
        );
        return supportFeature ? 
          t('showcase.pricing.comparison.values.priority', 'Priority') : 
          t('showcase.pricing.comparison.values.standard', 'Standard');
      }
    }
  ];

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

                      {/* Category Rows */}
                      {comparisonCategories.map((category, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-4 font-medium sticky left-0 bg-card/50 backdrop-blur-sm">
                            {category.label}
                          </td>
                          {selectedTiers.map(tierIndex => (
                            <td key={tierIndex} className="p-4 text-center">
                              {tiers[tierIndex].isEnterprise ? (
                                <span className="text-amber-500 font-semibold">
                                  {t('showcase.pricing.comparison.values.custom', 'Personalizado')}
                                </span>
                              ) : (
                                <span className="font-bold text-foreground">
                                  {category.getValue(tiers[tierIndex])}
                                </span>
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
