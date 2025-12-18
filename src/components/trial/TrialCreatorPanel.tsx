import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles,
  Loader2,
  Copy,
  RefreshCw,
  Lightbulb,
  Languages,
  Wand2,
  Brain,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useContentGenerator } from '@/hooks/useContentGenerator';

interface BrandProfile {
  brandName: string;
  tone: string;
  style: string;
  colors: string[];
  keywords: string[];
  personality: string;
}

interface TrialCreatorPanelProps {
  brandProfile: BrandProfile;
  onGoToDashboard: () => void;
}

const TrialCreatorPanel = ({ brandProfile, onGoToDashboard }: TrialCreatorPanelProps) => {
  const { 
    generateCopy, 
    generateVariants, 
    generateIdeas, 
    improveContent, 
    translateContent,
    isGenerating 
  } = useContentGenerator();

  // Customizable tone/style from brand profile
  const [selectedTone, setSelectedTone] = useState(brandProfile.tone || 'profesional');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');

  // Copy Generator State
  const [copyTopic, setCopyTopic] = useState('');
  const [copyResult, setCopyResult] = useState<any>(null);

  // Variants State
  const [variantContent, setVariantContent] = useState('');
  const [variantsResult, setVariantsResult] = useState<any>(null);

  // Ideas State
  const [ideasTopic, setIdeasTopic] = useState(brandProfile.keywords[0] || '');
  const [ideasResult, setIdeasResult] = useState<any>(null);

  // Improve State
  const [improveContent_, setImproveContent] = useState('');
  const [improveResult, setImproveResult] = useState<any>(null);

  // Translate State
  const [translateContent_, setTranslateContent] = useState('');
  const [translateLang, setTranslateLang] = useState('inglés');
  const [translateResult, setTranslateResult] = useState<any>(null);

  const brandContext = `Marca: ${brandProfile.brandName}. Estilo: ${brandProfile.style}. Personalidad: ${brandProfile.personality}. Keywords: ${brandProfile.keywords.join(', ')}`;

  const handleGenerateCopy = async () => {
    const result = await generateCopy({
      topic: copyTopic,
      platform: selectedPlatform,
      tone: selectedTone,
      context: brandContext
    });
    if (result) setCopyResult(result);
  };

  const handleGenerateVariants = async () => {
    const result = await generateVariants(variantContent, { 
      platform: selectedPlatform,
      tone: selectedTone,
      context: brandContext
    });
    if (result) setVariantsResult(result);
  };

  const handleGenerateIdeas = async () => {
    const result = await generateIdeas(ideasTopic, { 
      platform: selectedPlatform,
      context: brandContext
    });
    if (result) setIdeasResult(result);
  };

  const handleImprove = async () => {
    const result = await improveContent(improveContent_, { 
      platform: selectedPlatform,
      tone: selectedTone,
      context: brandContext
    });
    if (result) setImproveResult(result);
  };

  const handleTranslate = async () => {
    const result = await translateContent(translateContent_, translateLang);
    if (result) setTranslateResult(result);
  };

  const toneOptions = [
    { value: 'profesional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'divertido', label: 'Divertido' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'inspirador', label: 'Inspirador' },
    { value: 'educativo', label: 'Educativo' },
    { value: 'elegante', label: 'Elegante' },
  ];

  // Generate brand analysis summary
  const getBrandAnalysisSummary = () => {
    const categoryDescriptions: Record<string, string> = {
      'tecnología': 'tecnología e innovación digital',
      'moda': 'moda y estilo de vida',
      'salud': 'salud y bienestar',
      'gastronomía': 'gastronomía y experiencias culinarias',
      'fitness': 'fitness y vida activa',
      'educación': 'educación y desarrollo',
      'negocios': 'negocios y emprendimiento',
      'creatividad': 'creatividad y diseño',
    };

    const toneDescriptions: Record<string, string> = {
      'profesional': 'comunicación profesional y estructurada',
      'casual': 'estilo casual y cercano',
      'divertido': 'tono divertido y entretenido',
      'inspirador': 'mensajes inspiradores y motivacionales',
      'elegante': 'comunicación elegante y sofisticada',
      'educativo': 'enfoque educativo e informativo',
    };

    const styleDescriptions: Record<string, string> = {
      'moderno': 'estética moderna y contemporánea',
      'minimalista': 'diseño minimalista y limpio',
      'vibrante': 'estilo vibrante y lleno de energía',
      'corporativo': 'imagen corporativa y seria',
      'creativo': 'enfoque creativo y original',
      'tradicional': 'valores tradicionales y atemporales',
    };

    const keywords = brandProfile.keywords.slice(0, 3).join(', ');
    const tone = toneDescriptions[brandProfile.tone.toLowerCase()] || `tono ${brandProfile.tone}`;
    const style = styleDescriptions[brandProfile.style.toLowerCase()] || `estilo ${brandProfile.style}`;
    
    return `Al analizar el contenido de **${brandProfile.brandName}**, identificamos una marca con una identidad clara y distintiva. Su comunicación se caracteriza por una ${tone}, combinada con una ${style}. Los pilares de contenido giran en torno a: ${keywords}. La personalidad de marca transmite ${brandProfile.personality.toLowerCase()}, lo que permite conectar de manera auténtica con su audiencia y diferenciarse en su categoría.`;
  };

  return (
    <div className="space-y-8">
      {/* Brand Profile Header */}
      <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-electric-cyan to-purple-accent flex items-center justify-center text-white text-2xl font-bold">
                {brandProfile.brandName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{brandProfile.brandName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-purple-accent/20 text-purple-accent border-purple-accent/30">
                    {brandProfile.tone}
                  </Badge>
                  <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30">
                    {brandProfile.style}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {brandProfile.keywords.slice(0, 4).map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-background/50 text-muted-foreground text-sm border border-border/50">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Analysis Summary */}
      <Card className="bg-gradient-to-br from-purple-accent/10 to-electric-cyan/10 backdrop-blur-sm border-purple-accent/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-accent to-electric-cyan flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Análisis de Tono y Estilo
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  IA Completado
                </Badge>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {getBrandAnalysisSummary().split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-electric-cyan">{part}</strong> : part
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Settings */}
      <Card className="bg-card/20 backdrop-blur-sm border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground text-sm">Personaliza tu tono:</Label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="w-40 bg-background/50 border-border/50 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {toneOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground text-sm">Plataforma:</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-36 bg-background/50 border-border/50 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Perfil de marca cargado
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Creator Tabs */}
      <Tabs defaultValue="copy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card/30 backdrop-blur-sm border border-electric-cyan/20 h-12">
          <TabsTrigger value="copy" className="text-foreground/70 data-[state=active]:text-electric-cyan data-[state=active]:bg-electric-cyan/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Copy
          </TabsTrigger>
          <TabsTrigger value="variants" className="text-foreground/70 data-[state=active]:text-purple-accent data-[state=active]:bg-purple-accent/20">
            <Copy className="w-4 h-4 mr-2" />
            Variantes
          </TabsTrigger>
          <TabsTrigger value="ideas" className="text-foreground/70 data-[state=active]:text-yellow-400 data-[state=active]:bg-yellow-400/20">
            <Lightbulb className="w-4 h-4 mr-2" />
            Ideas
          </TabsTrigger>
          <TabsTrigger value="improve" className="text-foreground/70 data-[state=active]:text-green-400 data-[state=active]:bg-green-400/20">
            <Wand2 className="w-4 h-4 mr-2" />
            Mejorar
          </TabsTrigger>
          <TabsTrigger value="translate" className="text-foreground/70 data-[state=active]:text-blue-400 data-[state=active]:bg-blue-400/20">
            <Languages className="w-4 h-4 mr-2" />
            Traducir
          </TabsTrigger>
        </TabsList>

        {/* Copy Generator */}
        <TabsContent value="copy">
          <Card className="bg-card/30 backdrop-blur-sm border border-electric-cyan/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-electric-cyan" />
                Generador de Copy
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Genera copies completos para {selectedPlatform} con el tono {selectedTone} de {brandProfile.brandName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground">Tema / Producto</Label>
                <Input 
                  placeholder={`Ej: nuevo lanzamiento de ${brandProfile.brandName}, promoción, evento...`}
                  value={copyTopic}
                  onChange={(e) => setCopyTopic(e.target.value)}
                  className="bg-card/30 border-electric-cyan/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button 
                onClick={handleGenerateCopy}
                disabled={isGenerating || !copyTopic}
                className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold shadow-glow-cyan"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generar Copy
              </Button>

              {copyResult?.copy && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-card/30 border border-electric-cyan/30 space-y-3"
                >
                  <div>
                    <Label className="text-electric-cyan">Hook</Label>
                    <p className="mt-1 text-foreground">{copyResult.copy.hook}</p>
                  </div>
                  <div>
                    <Label className="text-electric-cyan">Cuerpo</Label>
                    <p className="mt-1 text-foreground">{copyResult.copy.body}</p>
                  </div>
                  <div>
                    <Label className="text-electric-cyan">CTA</Label>
                    <p className="mt-1 text-foreground">{copyResult.copy.cta}</p>
                  </div>
                  <div>
                    <Label className="text-electric-cyan">Copy Completo</Label>
                    <div className="mt-1 p-3 bg-card/50 rounded border border-electric-cyan/10 text-foreground whitespace-pre-wrap">
                      {copyResult.copy.fullCopy}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {copyResult.copy.hashtags?.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-purple-accent/50 text-purple-accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Generator */}
        <TabsContent value="variants">
          <Card className="bg-card/30 backdrop-blur-sm border border-purple-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Copy className="w-5 h-5 text-purple-accent" />
                Generador de Variantes A/B
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Genera 3 variantes con enfoques diferentes para testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground">Contenido Original</Label>
                <Textarea 
                  placeholder="Pega tu copy original aquí para generar variantes..."
                  value={variantContent}
                  onChange={(e) => setVariantContent(e.target.value)}
                  rows={4}
                  className="bg-card/30 border-purple-accent/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button 
                onClick={handleGenerateVariants} 
                disabled={isGenerating || !variantContent}
                className="bg-gradient-to-r from-purple-accent to-electric-cyan hover:opacity-90 text-background font-semibold"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Generar 3 Variantes
              </Button>

              {variantsResult?.variants && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-3"
                >
                  {variantsResult.variants.map((variant: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg bg-card/30 border border-purple-accent/30">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-accent/20 text-purple-accent">{variant.name}</Badge>
                        <span className="text-xs text-muted-foreground">{variant.approach}</span>
                      </div>
                      <p className="text-sm text-foreground">{variant.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Rendimiento esperado: {variant.expectedPerformance}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ideas Generator */}
        <TabsContent value="ideas">
          <Card className="bg-card/30 backdrop-blur-sm border border-yellow-400/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Generador de Ideas
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Genera 5 ideas de contenido personalizadas para {brandProfile.brandName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground">Tema General</Label>
                <Input 
                  placeholder={`Ej: ${brandProfile.keywords.join(', ')}...`}
                  value={ideasTopic}
                  onChange={(e) => setIdeasTopic(e.target.value)}
                  className="bg-card/30 border-yellow-400/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button 
                onClick={handleGenerateIdeas}
                disabled={isGenerating || !ideasTopic}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-background font-semibold"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Lightbulb className="w-4 h-4 mr-2" />
                )}
                Generar 5 Ideas
              </Button>

              {ideasResult?.ideas && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-3"
                >
                  {ideasResult.ideas.map((idea: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg bg-card/30 border border-yellow-400/30">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{idea.title}</h4>
                        <Badge 
                          className={
                            idea.engagementPotential?.toLowerCase().includes('alto') 
                              ? 'bg-green-500/20 text-green-400' 
                              : idea.engagementPotential?.toLowerCase().includes('medio')
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-muted/50 text-muted-foreground'
                          }
                        >
                          {idea.engagementPotential}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{idea.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>📹 {idea.format}</span>
                        <span>🕐 {idea.bestTime}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improve Content */}
        <TabsContent value="improve">
          <Card className="bg-card/30 backdrop-blur-sm border border-green-400/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Wand2 className="w-5 h-5 text-green-400" />
                Mejorar Contenido
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Mejora tu contenido existente con el estilo de {brandProfile.brandName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground">Contenido a Mejorar</Label>
                <Textarea 
                  placeholder="Pega el contenido que quieres mejorar..."
                  value={improveContent_}
                  onChange={(e) => setImproveContent(e.target.value)}
                  rows={4}
                  className="bg-card/30 border-green-400/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button 
                onClick={handleImprove}
                disabled={isGenerating || !improveContent_}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90 text-background font-semibold"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Mejorar Contenido
              </Button>

              {improveResult?.improved && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-card/30 border border-green-400/30 space-y-3"
                >
                  <div>
                    <Label className="text-green-400">Contenido Mejorado</Label>
                    <div className="mt-1 p-3 bg-card/50 rounded border border-green-400/10 text-foreground whitespace-pre-wrap">
                      {improveResult.improved.content}
                    </div>
                  </div>
                  <div>
                    <Label className="text-green-400">Cambios Realizados</Label>
                    <ul className="mt-1 space-y-1">
                      {improveResult.improved.changes?.map((change: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    Score: {improveResult.improved.improvementScore}
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Translate */}
        <TabsContent value="translate">
          <Card className="bg-card/30 backdrop-blur-sm border border-blue-400/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Languages className="w-5 h-5 text-blue-400" />
                Traducir y Adaptar
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Traduce y adapta culturalmente tu contenido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground">Contenido a Traducir</Label>
                <Textarea 
                  placeholder="Pega el contenido que quieres traducir..."
                  value={translateContent_}
                  onChange={(e) => setTranslateContent(e.target.value)}
                  rows={4}
                  className="bg-card/30 border-blue-400/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-foreground">Idioma Destino</Label>
                  <Select value={translateLang} onValueChange={setTranslateLang}>
                    <SelectTrigger className="bg-card/30 border-blue-400/20 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="inglés">Inglés</SelectItem>
                      <SelectItem value="portugués">Portugués</SelectItem>
                      <SelectItem value="francés">Francés</SelectItem>
                      <SelectItem value="alemán">Alemán</SelectItem>
                      <SelectItem value="italiano">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleTranslate}
                    disabled={isGenerating || !translateContent_}
                    className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:opacity-90 text-background font-semibold"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Languages className="w-4 h-4 mr-2" />
                    )}
                    Traducir
                  </Button>
                </div>
              </div>

              {translateResult?.translation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-card/30 border border-blue-400/30 space-y-3"
                >
                  <div>
                    <Label className="text-blue-400">Traducción</Label>
                    <div className="mt-1 p-3 bg-card/50 rounded border border-blue-400/10 text-foreground whitespace-pre-wrap">
                      {translateResult.translation.content}
                    </div>
                  </div>
                  {translateResult.translation.culturalNotes?.length > 0 && (
                    <div>
                      <Label className="text-blue-400">Notas Culturales</Label>
                      <ul className="mt-1 space-y-1">
                        {translateResult.translation.culturalNotes.map((note: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">• {note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CTA to Dashboard */}
      <div className="text-center pt-8 border-t border-border/30">
        <p className="text-muted-foreground mb-4">
          ¿Listo para explorar todas las funcionalidades de Brainy?
        </p>
        <Button
          onClick={onGoToDashboard}
          className="h-14 px-8 text-lg bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold shadow-glow-cyan"
        >
          <Brain className="w-5 h-5 mr-2" />
          Ir a mi Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Tu trial de 45 días está activo • Acceso completo a los 5 Brainies
        </p>
      </div>
    </div>
  );
};

export default TrialCreatorPanel;
