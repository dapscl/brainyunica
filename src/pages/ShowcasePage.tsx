import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  Bot,
  Calendar,
  Target,
  MessageSquare,
  TrendingUp,
  Zap,
  Palette,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatedHero } from '@/components/showcase/AnimatedHero';
import { BrainCard } from '@/components/showcase/BrainCard';
import AIMediaBuyerPanel from '@/components/showcase/AIMediaBuyerPanel';
import CreativePerformanceTracker from '@/components/showcase/CreativePerformanceTracker';
import MultiChannelCommunication from '@/components/showcase/MultiChannelCommunication';
import WhatsAppProjectManager from '@/components/showcase/WhatsAppProjectManager';
import InspirationLibrary from '@/components/showcase/InspirationLibrary';
import { FAQSection } from '@/components/showcase/FAQSection';
import { AnimatedMetrics } from '@/components/showcase/AnimatedMetrics';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { motion } from 'framer-motion';

const ShowcasePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background dark">
      {/* Language Selector - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 px-6 py-3 text-electric-cyan border-electric-cyan/30 bg-electric-cyan/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('showcase.hero.badge')}
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold tracking-tighter uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-foreground via-electric-cyan to-purple-accent bg-clip-text text-transparent">
              {t('showcase.hero.title.line1')}
            </span>
            <br />
            <span className="text-foreground">
              {t('showcase.hero.title.line2')}
            </span>
            <br />
            <span className="text-electric-cyan">
              {t('showcase.hero.title.line3')}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('showcase.hero.subtitle')}
            <br />
            <span className="text-foreground font-medium">{t('showcase.hero.subtitleBold')}</span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/lead-capture')}
              className="gap-2 text-lg px-10 py-7 bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan transition-all duration-300"
            >
              🚀 {t('showcase.hero.ctaPrimary')}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('brains')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-10 py-7 gap-2 border-electric-cyan/30 bg-background/50 backdrop-blur-sm text-electric-cyan hover:bg-electric-cyan/10 uppercase tracking-wide transition-all duration-300"
            >
              {t('showcase.hero.ctaSecondary')}
            </Button>
          </motion.div>
        </div>

        {/* Animated Hero Interface */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <AnimatedHero />
        </motion.div>
      </section>

      {/* Brains Section */}
      <section id="brains" className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-foreground">{t('showcase.brains.title')}</span> <span className="text-electric-cyan">{t('showcase.brains.titleHighlight')}</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('showcase.brains.subtitle')}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <BrainCard 
              icon={Palette}
              title={t('showcase.brains.creator.title')}
              description={t('showcase.brains.creator.description')}
              color="purple"
              delay={0}
            />
            
            <BrainCard 
              icon={Calendar}
              title={t('showcase.brains.calendar.title')}
              description={t('showcase.brains.calendar.description')}
              color="purple"
              delay={0.1}
            />
            
            <BrainCard 
              icon={Target}
              title={t('showcase.brains.ad.title')}
              description={t('showcase.brains.ad.description')}
              color="cyan"
              delay={0.2}
            />
            
            <BrainCard 
              icon={MessageSquare}
              title={t('showcase.brains.chat.title')}
              description={t('showcase.brains.chat.description')}
              color="green"
              delay={0.3}
            />
            
            <div className="md:col-span-2">
              <BrainCard 
                icon={TrendingUp}
                title={t('showcase.brains.trend.title')}
                description={t('showcase.brains.trend.description')}
                color="blue"
                delay={0.4}
              />
            </div>
          </div>

          <motion.p 
            className="text-center text-lg text-muted-foreground mt-12 max-w-3xl mx-auto font-light italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {t('showcase.brains.footer')}
          </motion.p>
        </div>
      </section>

      {/* Results in Action Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-foreground">{t('showcase.results.title')}</span> <span className="text-purple-accent">{t('showcase.results.titleHighlight')}</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('showcase.results.subtitle')}
              <br />
              <span className="text-foreground font-medium">{t('showcase.results.subtitleBold')}</span>
            </motion.p>
          </div>

          <div className="space-y-20">
            <WhatsAppProjectManager />
            <AIMediaBuyerPanel />
            <CreativePerformanceTracker />
            <MultiChannelCommunication />
            <InspirationLibrary />
          </div>
        </div>
      </section>

      {/* Conversations Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-12 rounded-3xl bg-card/30 backdrop-blur-sm border border-green-500/20 shadow-[0_0_60px_hsl(140_70%_50%_/_0.2)] hover:shadow-[0_0_80px_hsl(140_70%_50%_/_0.3)] transition-all duration-500"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="bg-green-500 p-4 rounded-2xl shadow-glow">
                <MessageSquare className="w-8 h-8 text-background" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-foreground">
              {t('showcase.conversations.title')}
              <br />
              <span className="text-green-500">{t('showcase.conversations.titleHighlight')}</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 font-light leading-relaxed">
              {t('showcase.conversations.description')}
            </p>

            <p className="text-lg text-foreground font-medium italic">
              {t('showcase.conversations.footer')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Animated Metrics Section */}
      <AnimatedMetrics />

      {/* Everything Connected Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Zap className="w-20 h-20 text-electric-cyan animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full"
                ></motion.div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight text-foreground">
              <span className="text-foreground">{t('showcase.connected.title')}</span>
              <br />
              <span className="text-electric-cyan">{t('showcase.connected.titleHighlight')}</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-4 font-light leading-relaxed">
              {t('showcase.connected.description')}
            </p>

            <p className="text-2xl text-foreground font-bold">
              {t('showcase.connected.footer')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <FAQSection />
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-16 rounded-3xl bg-card/30 backdrop-blur-sm border border-electric-cyan/30 shadow-glow-cyan hover:shadow-[0_0_100px_hsl(189_94%_63%_/_0.4)] transition-all duration-500"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-electric-cyan to-purple-accent p-5 rounded-2xl shadow-glow-cyan">
                <Bot className="w-10 h-10 text-background" />
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight text-foreground">
              <span className="text-foreground">{t('showcase.finalCta.title')}</span>
              <br />
              <span className="text-electric-cyan">{t('showcase.finalCta.titleHighlight')}</span>
            </h2>
            
            <p className="text-2xl text-foreground font-medium mb-4">
              {t('showcase.finalCta.subtitle')}
            </p>

            <p className="text-5xl font-bold mb-12 bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
              {t('showcase.finalCta.product')}
            </p>

            <Button 
              size="lg"
              onClick={() => navigate('/lead-capture')}
              className="text-xl px-12 py-8 bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan transition-all duration-300"
            >
              {t('showcase.finalCta.button')}
            </Button>

            <p className="text-sm text-foreground/70 mt-6 font-light">
              {t('showcase.finalCta.footer')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage;