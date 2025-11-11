import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, DollarSign, Wrench, HeadphonesIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const FAQSection = () => {
  const { t } = useTranslation();
  const faqCategories = [
    {
      id: "pricing",
      title: t('showcase.faq.categories.pricing.title'),
      icon: DollarSign,
      color: "text-green-500",
      questions: [
        {
          q: t('showcase.faq.categories.pricing.questions.variablePricing.q'),
          a: t('showcase.faq.categories.pricing.questions.variablePricing.a')
        },
        {
          q: t('showcase.faq.categories.pricing.questions.integrationCost.q'),
          a: t('showcase.faq.categories.pricing.questions.integrationCost.a')
        },
        {
          q: t('showcase.faq.categories.pricing.questions.tierChange.q'),
          a: t('showcase.faq.categories.pricing.questions.tierChange.a')
        },
      ]
    },
    {
      id: "integration",
      title: t('showcase.faq.categories.integration.title'),
      icon: Wrench,
      color: "text-blue-500",
      questions: [
        {
          q: t('showcase.faq.categories.integration.questions.setupTime.q'),
          a: t('showcase.faq.categories.integration.questions.setupTime.a')
        },
        {
          q: t('showcase.faq.categories.integration.questions.platforms.q'),
          a: t('showcase.faq.categories.integration.questions.platforms.a')
        },
        {
          q: t('showcase.faq.categories.integration.questions.technicalKnowledge.q'),
          a: t('showcase.faq.categories.integration.questions.technicalKnowledge.a')
        },
      ]
    },
    {
      id: "features",
      title: t('showcase.faq.categories.features.title'),
      icon: Sparkles,
      color: "text-purple-500",
      questions: [
        {
          q: t('showcase.faq.categories.features.questions.whatsappManager.q'),
          a: t('showcase.faq.categories.features.questions.whatsappManager.a')
        },
        {
          q: t('showcase.faq.categories.features.questions.mediaBuyer.q'),
          a: t('showcase.faq.categories.features.questions.mediaBuyer.a')
        },
        {
          q: t('showcase.faq.categories.features.questions.brandLimit.q'),
          a: t('showcase.faq.categories.features.questions.brandLimit.a')
        },
      ]
    },
    {
      id: "support",
      title: t('showcase.faq.categories.support.title'),
      icon: HeadphonesIcon,
      color: "text-orange-500",
      questions: [
        {
          q: t('showcase.faq.categories.support.questions.supportTypes.q'),
          a: t('showcase.faq.categories.support.questions.supportTypes.a')
        },
        {
          q: t('showcase.faq.categories.support.questions.training.q'),
          a: t('showcase.faq.categories.support.questions.training.a')
        },
        {
          q: t('showcase.faq.categories.support.questions.refund.q'),
          a: t('showcase.faq.categories.support.questions.refund.a')
        },
      ]
    }
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4 px-4 py-2 border-electric-cyan/30 bg-electric-cyan/5">
          <HelpCircle className="w-4 h-4 mr-2" />
          {t('showcase.faq.badge')}
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground uppercase tracking-tight">
          {t('showcase.faq.title')}
        </h2>
        <p className="text-xl text-muted-foreground font-light">
          {t('showcase.faq.subtitle')} {t('showcase.faq.notFound')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {faqCategories.map((category, idx) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="border-b border-border/50 p-6 bg-card/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center ${category.color}`}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">{category.title}</h3>
                  </div>
                </div>
                
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, idx) => (
                      <AccordionItem 
                        key={`${category.id}-${idx}`} 
                        value={`${category.id}-${idx}`}
                        className="border-b border-border/50 last:border-b-0 px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 text-foreground">
                          <span className="font-medium pr-4">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 font-light">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-electric-cyan/10 to-purple-accent/10 border-electric-cyan/20 mt-12 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3 text-foreground uppercase tracking-tight">{t('showcase.faq.stillQuestions.title')}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto font-light">
              {t('showcase.faq.stillQuestions.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://calendly.com/brainy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-electric-cyan text-background font-bold hover:opacity-90 transition-all duration-300 uppercase tracking-wide"
              >
                {t('showcase.faq.stillQuestions.scheduleDemo')}
              </a>
              <a 
                href="mailto:hola@brainy.unica.la"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted transition-all duration-300 font-medium"
              >
                {t('showcase.faq.stillQuestions.contactSales')}
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};