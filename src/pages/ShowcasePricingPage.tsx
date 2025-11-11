import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, TrendingUp, Zap, Crown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { PricingComparison } from '@/components/showcase/PricingComparison';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ShowcasePricingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedTiers, setExpandedTiers] = useState<{ [key: number]: boolean }>({});

  const toggleExpanded = (index: number) => {
    setExpandedTiers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Get all features from Starter tier
  const getStarterFeatures = () => [
    t('showcase.pricing.tiers.starter.features.users'),
    t('showcase.pricing.tiers.starter.features.whatsapp'),
    t('showcase.pricing.tiers.starter.features.brainies'),
    t('showcase.pricing.tiers.starter.features.brands'),
    t('showcase.pricing.tiers.starter.features.ai'),
    t('showcase.pricing.tiers.starter.features.editor'),
    t('showcase.pricing.tiers.starter.features.posts'),
    t('showcase.pricing.tiers.starter.features.integrations'),
    t('showcase.pricing.tiers.starter.features.dashboard'),
    t('showcase.pricing.tiers.starter.features.storage')
  ];

  // Get all features from Small Agencies tier (including Starter)
  const getSmallAgenciesFeatures = () => [
    ...getStarterFeatures(),
    t('showcase.pricing.tiers.smallAgencies.features.users'),
    t('showcase.pricing.tiers.smallAgencies.features.brands'),
    t('showcase.pricing.tiers.smallAgencies.features.ai'),
    t('showcase.pricing.tiers.smallAgencies.features.workflows'),
    t('showcase.pricing.tiers.smallAgencies.features.posts'),
    t('showcase.pricing.tiers.smallAgencies.features.integrations'),
    t('showcase.pricing.tiers.smallAgencies.features.dashboard'),
    t('showcase.pricing.tiers.smallAgencies.features.storage')
  ];

  const pricingTiers = [
    {
      name: t('showcase.pricing.tiers.starter.name'),
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      adSpend: t('showcase.pricing.tiers.starter.targetAudience'),
      basePrice: t('showcase.pricing.tiers.starter.basePrice'),
      integrationFee: t('showcase.pricing.tiers.starter.integrationFee'),
      percentage: t('showcase.pricing.tiers.starter.percentage'),
      maxMonthly: 'Variable',
      description: t('showcase.pricing.tiers.starter.description'),
      prefix: null,
      features: [
        t('showcase.pricing.tiers.starter.features.users'),
        t('showcase.pricing.tiers.starter.features.whatsapp'),
        t('showcase.pricing.tiers.starter.features.brainies'),
        t('showcase.pricing.tiers.starter.features.brands'),
        t('showcase.pricing.tiers.starter.features.ai'),
        t('showcase.pricing.tiers.starter.features.editor'),
        t('showcase.pricing.tiers.starter.features.posts'),
        t('showcase.pricing.tiers.starter.features.integrations'),
        t('showcase.pricing.tiers.starter.features.dashboard'),
        t('showcase.pricing.tiers.starter.features.storage')
      ],
      recommended: false,
      isEnterprise: false
    },
    {
      name: t('showcase.pricing.tiers.smallAgencies.name'),
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      adSpend: t('showcase.pricing.tiers.smallAgencies.targetAudience'),
      basePrice: t('showcase.pricing.tiers.smallAgencies.basePrice'),
      integrationFee: t('showcase.pricing.tiers.smallAgencies.integrationFee'),
      percentage: t('showcase.pricing.tiers.smallAgencies.percentage'),
      maxMonthly: 'Variable',
      description: t('showcase.pricing.tiers.smallAgencies.description'),
      prefix: t('showcase.pricing.tiers.smallAgencies.prefix'),
      features: [
        t('showcase.pricing.tiers.smallAgencies.features.users'),
        t('showcase.pricing.tiers.smallAgencies.features.brands'),
        t('showcase.pricing.tiers.smallAgencies.features.ai'),
        t('showcase.pricing.tiers.smallAgencies.features.workflows'),
        t('showcase.pricing.tiers.smallAgencies.features.posts'),
        t('showcase.pricing.tiers.smallAgencies.features.integrations'),
        t('showcase.pricing.tiers.smallAgencies.features.dashboard'),
        t('showcase.pricing.tiers.smallAgencies.features.storage')
      ],
      recommended: true,
      isEnterprise: false
    },
    {
      name: t('showcase.pricing.tiers.scaledAgencies.name'),
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      adSpend: t('showcase.pricing.tiers.scaledAgencies.targetAudience'),
      basePrice: t('showcase.pricing.tiers.scaledAgencies.basePrice'),
      integrationFee: t('showcase.pricing.tiers.scaledAgencies.integrationFee'),
      percentage: t('showcase.pricing.tiers.scaledAgencies.percentage'),
      maxMonthly: 'Variable',
      description: t('showcase.pricing.tiers.scaledAgencies.description'),
      prefix: t('showcase.pricing.tiers.scaledAgencies.prefix'),
      features: [
        t('showcase.pricing.tiers.scaledAgencies.features.users'),
        t('showcase.pricing.tiers.scaledAgencies.features.brands'),
        t('showcase.pricing.tiers.scaledAgencies.features.automation'),
        t('showcase.pricing.tiers.scaledAgencies.features.ai'),
        t('showcase.pricing.tiers.scaledAgencies.features.posts'),
        t('showcase.pricing.tiers.scaledAgencies.features.analytics'),
        t('showcase.pricing.tiers.scaledAgencies.features.storage'),
        t('showcase.pricing.tiers.scaledAgencies.features.support')
      ],
      recommended: false,
      isEnterprise: false
    },
    {
      name: t('showcase.pricing.tiers.enterprise.name'),
      icon: Crown,
      color: 'from-red-500 to-pink-600',
      adSpend: t('showcase.pricing.tiers.enterprise.targetAudience'),
      basePrice: t('showcase.pricing.tiers.enterprise.basePrice'),
      integrationFee: t('showcase.pricing.tiers.enterprise.integrationFee'),
      percentage: t('showcase.pricing.tiers.enterprise.percentage'),
      maxMonthly: 'Variable',
      description: t('showcase.pricing.tiers.enterprise.description'),
      prefix: null,
      ctaTitle: t('showcase.pricing.tiers.enterprise.cta.title'),
      ctaSubtitle: t('showcase.pricing.tiers.enterprise.cta.subtitle'),
      ctaButton: t('showcase.pricing.tiers.enterprise.cta.button'),
      features: [],
      recommended: false,
      isEnterprise: true
    }
  ];

  const adSpendExamplesByTier = {
    starter: [
      { spend: t('showcase.pricing.adSpendExamples.starter.example1.spend'), cost: t('showcase.pricing.adSpendExamples.starter.example1.cost') },
      { spend: t('showcase.pricing.adSpendExamples.starter.example2.spend'), cost: t('showcase.pricing.adSpendExamples.starter.example2.cost') },
      { spend: t('showcase.pricing.adSpendExamples.starter.example3.spend'), cost: t('showcase.pricing.adSpendExamples.starter.example3.cost') },
    ],
    smallAgencies: [
      { spend: t('showcase.pricing.adSpendExamples.smallAgencies.example1.spend'), cost: t('showcase.pricing.adSpendExamples.smallAgencies.example1.cost') },
      { spend: t('showcase.pricing.adSpendExamples.smallAgencies.example2.spend'), cost: t('showcase.pricing.adSpendExamples.smallAgencies.example2.cost') },
      { spend: t('showcase.pricing.adSpendExamples.smallAgencies.example3.spend'), cost: t('showcase.pricing.adSpendExamples.smallAgencies.example3.cost') },
    ],
    scaledAgencies: [
      { spend: t('showcase.pricing.adSpendExamples.scaledAgencies.example1.spend'), cost: t('showcase.pricing.adSpendExamples.scaledAgencies.example1.cost') },
      { spend: t('showcase.pricing.adSpendExamples.scaledAgencies.example2.spend'), cost: t('showcase.pricing.adSpendExamples.scaledAgencies.example2.cost') },
      { spend: t('showcase.pricing.adSpendExamples.scaledAgencies.example3.spend'), cost: t('showcase.pricing.adSpendExamples.scaledAgencies.example3.cost') },
    ]
  };

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseSEO
        title={t('showcase.pricing.title', 'Pricing')}
        description={t('showcase.pricing.description', 'Transparent pricing that scales with your ad spend. Choose the right plan for your agency.')}
        path="/pricing"
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-20">
        <ShowcaseBreadcrumbs />
        
        <motion.div 
          className="text-center max-w-4xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-6 px-6 py-3 text-electric-cyan border-electric-cyan/30 bg-electric-cyan/5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            {t('showcase.pricing.badge')}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">
            <span className="text-foreground">{t('showcase.pricing.headline.line1')}</span>{' '}
            <span className="text-electric-cyan">{t('showcase.pricing.headline.line2')}</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            {t('showcase.pricing.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
        <Card className="mb-16 border-electric-cyan/20 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-center uppercase tracking-tight">{t('showcase.pricing.howItWorks.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-electric-cyan">1</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">{t('showcase.pricing.howItWorks.step1.title')}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {t('showcase.pricing.howItWorks.step1.description')}
                </p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-purple-accent/10 border border-purple-accent/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-purple-accent">2</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">{t('showcase.pricing.howItWorks.step2.title')}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {t('showcase.pricing.howItWorks.step2.description')}
                </p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-green-500">3</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">{t('showcase.pricing.howItWorks.step3.title')}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {t('showcase.pricing.howItWorks.step3.description')}
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-electric-cyan/5 rounded-xl border border-electric-cyan/20 backdrop-blur-sm">
              <p className="text-center font-light">
                {t('showcase.pricing.howItWorks.example')} <span className="text-electric-cyan font-bold text-lg">{t('showcase.pricing.howItWorks.exampleTotal')}</span>
              </p>
            </div>
            
            <div className="mt-4 p-6 bg-purple-accent/5 rounded-xl border border-purple-accent/20 backdrop-blur-sm">
              <p className="text-center font-light">
                {t('showcase.pricing.howItWorks.integrationFee')}
              </p>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
              <Card 
                className={`relative overflow-hidden flex flex-col bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${
                  tier.recommended 
                    ? 'border-electric-cyan shadow-glow-cyan lg:scale-105 z-10 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]' 
                    : 'border-border/50 hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]'
                }`}
              >
                {tier.recommended && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-electric-cyan to-purple-accent text-background px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
                    {t('showcase.pricing.tiers.mostPopular')}
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 shadow-glow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2 font-light">{tier.description}</CardDescription>
                  
                  <div className="pt-4 space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-electric-cyan whitespace-nowrap">{tier.basePrice}<span className="text-sm text-muted-foreground font-normal">/mes</span></p>
                      <p className="text-sm text-muted-foreground font-medium whitespace-nowrap">+ {tier.percentage} de medios</p>
                    </div>
                    <div className="text-sm text-muted-foreground pt-3 border-t border-border/50">
                      <p className="font-medium">Setup: <span className="text-foreground">{tier.integrationFee}</span></p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <Button 
                    className={`w-full font-bold ${tier.recommended ? 'bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background' : 'border-electric-cyan/30 hover:bg-electric-cyan/10 hover:border-electric-cyan/50'}`}
                    variant={tier.recommended ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => tier.isEnterprise ? navigate('/lead-capture') : navigate('/lead-capture')}
                  >
                    {tier.isEnterprise ? tier.ctaButton : t('showcase.pricing.tiers.getStarted')}
                  </Button>

                  {tier.isEnterprise ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-center items-center text-center py-8">
                      <h3 className="text-xl font-bold text-electric-cyan">{tier.ctaTitle}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tier.ctaSubtitle}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 flex-1">
                      {tier.prefix && (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-electric-cyan">{tier.prefix}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(idx)}
                              className="text-xs h-auto py-1 px-2 text-electric-cyan hover:text-electric-cyan hover:bg-electric-cyan/10"
                            >
                              {expandedTiers[idx] ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  {t('showcase.pricing.inherited.hideAll')}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  {t('showcase.pricing.inherited.showAll')}
                                </>
                              )}
                            </Button>
                          </div>
                          
                          {expandedTiers[idx] && (
                            <div className="mb-4 pb-4 border-b border-border/30">
                              <p className="text-xs text-muted-foreground mb-2 italic">
                                {t('showcase.pricing.inherited.includes')} {idx === 1 ? t('showcase.pricing.tiers.starter.name') : t('showcase.pricing.tiers.smallAgencies.name')}:
                              </p>
                              {(idx === 1 ? getStarterFeatures() : getSmallAgenciesFeatures()).map((feature, i) => (
                                <div key={`inherited-${i}`} className="flex items-start gap-2 opacity-60 mb-1">
                                  <Check className="w-3 h-3 text-electric-cyan mt-0.5 flex-shrink-0" />
                                  <span className="text-xs leading-tight">{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-electric-cyan mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-tight font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Ad Spend Examples */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        <Card className="mb-12 border-electric-cyan/20 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-center uppercase tracking-tight">{t('showcase.pricing.adSpendExamples.title')}</CardTitle>
            <CardDescription className="text-center text-base mt-2">
              {t('showcase.pricing.adSpendExamples.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Starter Column */}
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-border/50">
                  <h3 className="text-xl font-bold text-electric-cyan mb-1">{t('showcase.pricing.tiers.starter.name')}</h3>
                  <p className="text-sm text-muted-foreground">{t('showcase.pricing.tiers.starter.percentage')} {t('showcase.pricing.adSpendExamples.mediaPercentage')}</p>
                </div>
                <div className="space-y-3">
                  {adSpendExamplesByTier.starter.map((example, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-electric-cyan/40"
                    >
                      <p className="font-semibold text-sm mb-1">{example.spend}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{example.cost}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small Agencies Column */}
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-border/50">
                  <h3 className="text-xl font-bold text-purple-accent mb-1">{t('showcase.pricing.tiers.smallAgencies.name')}</h3>
                  <p className="text-sm text-muted-foreground">{t('showcase.pricing.tiers.smallAgencies.percentage')} {t('showcase.pricing.adSpendExamples.mediaPercentage')}</p>
                </div>
                <div className="space-y-3">
                  {adSpendExamplesByTier.smallAgencies.map((example, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-accent/40"
                    >
                      <p className="font-semibold text-sm mb-1">{example.spend}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{example.cost}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scaled Agencies Column */}
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-border/50">
                  <h3 className="text-xl font-bold text-amber-500 mb-1">{t('showcase.pricing.tiers.scaledAgencies.name')}</h3>
                  <p className="text-sm text-muted-foreground">{t('showcase.pricing.tiers.scaledAgencies.percentage')} {t('showcase.pricing.adSpendExamples.mediaPercentage')}</p>
                </div>
                <div className="space-y-3">
                  {adSpendExamplesByTier.scaledAgencies.map((example, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-500/40"
                    >
                      <p className="font-semibold text-sm mb-1">{example.spend}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{example.cost}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-electric-cyan/5 rounded-xl border border-electric-cyan/20 backdrop-blur-sm">
              <p className="text-sm text-center font-light">
                <span className="font-bold text-foreground">Nota:</span> El porcentaje de medios se aplica sobre tu inversión publicitaria mensual total. 
                A mayor tier, menor porcentaje pagas (20% → 15% → 10%), optimizando tu costo conforme escalas.
              </p>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Why Variable Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('showcase.pricing.whyVariable.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  {t('showcase.pricing.whyVariable.fairScalability.title')}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  {t('showcase.pricing.whyVariable.fairScalability.description')}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  {t('showcase.pricing.whyVariable.alignedIncentives.title')}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  {t('showcase.pricing.whyVariable.alignedIncentives.description')}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  {t('showcase.pricing.whyVariable.noLimits.title')}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  {t('showcase.pricing.whyVariable.noLimits.description')}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  {t('showcase.pricing.whyVariable.transparency.title')}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  {t('showcase.pricing.whyVariable.transparency.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Interactive Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16"
        >
          <PricingComparison tiers={pricingTiers} />
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="border-electric-cyan/20 bg-gradient-to-br from-electric-cyan/5 to-transparent backdrop-blur-sm">
            <CardContent className="py-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">{t('showcase.pricing.cta.title')}</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg font-light">
                {t('showcase.pricing.cta.subtitle')}
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold"
                  onClick={() => navigate('/lead-capture')}
                >
                  <Sparkles className="w-4 h-4" />
                  {t('showcase.pricing.cta.button')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ShowcasePricingPage;
