import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Sparkles,
  Loader2,
  Copy,
  RefreshCw,
  Lightbulb,
  Languages,
  Wand2,
  Brain,
  CheckCircle2
} from 'lucide-react';
import { useContentGenerator } from '@/hooks/useContentGenerator';

const CreatorBrainyTestPage = () => {
  const navigate = useNavigate();
  const { 
    generateCopy, 
    generateVariants, 
    generateIdeas, 
    improveContent, 
    translateContent,
    isGenerating 
  } = useContentGenerator();

  // Copy Generator State
  const [copyTopic, setCopyTopic] = useState('');
  const [copyPlatform, setCopyPlatform] = useState('instagram');
  const [copyTone, setCopyTone] = useState('profesional');
  const [copyResult, setCopyResult] = useState<any>(null);

  // Variants State
  const [variantContent, setVariantContent] = useState('');
  const [variantsResult, setVariantsResult] = useState<any>(null);

  // Ideas State
  const [ideasTopic, setIdeasTopic] = useState('');
  const [ideasResult, setIdeasResult] = useState<any>(null);

  // Improve State
  const [improveContent_, setImproveContent] = useState('');
  const [improveResult, setImproveResult] = useState<any>(null);

  // Translate State
  const [translateContent_, setTranslateContent] = useState('');
  const [translateLang, setTranslateLang] = useState('inglés');
  const [translateResult, setTranslateResult] = useState<any>(null);

  const handleGenerateCopy = async () => {
    const result = await generateCopy({
      topic: copyTopic,
      platform: copyPlatform,
      tone: copyTone
    });
    if (result) setCopyResult(result);
  };

  const handleGenerateVariants = async () => {
    const result = await generateVariants(variantContent, { platform: copyPlatform });
    if (result) setVariantsResult(result);
  };

  const handleGenerateIdeas = async () => {
    const result = await generateIdeas(ideasTopic, { platform: copyPlatform });
    if (result) setIdeasResult(result);
  };

  const handleImprove = async () => {
    const result = await improveContent(improveContent_, { platform: copyPlatform });
    if (result) setImproveResult(result);
  };

  const handleTranslate = async () => {
    const result = await translateContent(translateContent_, translateLang);
    if (result) setTranslateResult(result);
  };

  return (
    <div className="min-h-screen bg-dark-surface">
      {/* Header */}
      <div className="border-b border-electric-cyan/20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-foreground hover:text-electric-cyan"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
              CreatorBrainy Test Panel
            </h1>
          </div>
          <p className="text-muted-foreground">
            Prueba todas las funcionalidades de generación de contenido con IA
          </p>
          <Badge className="mt-4 bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Edge Function Activa
          </Badge>
        </div>

        <Tabs defaultValue="copy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card/50">
            <TabsTrigger value="copy" className="data-[state=active]:bg-electric-cyan/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Copy
            </TabsTrigger>
            <TabsTrigger value="variants" className="data-[state=active]:bg-electric-cyan/20">
              <Copy className="w-4 h-4 mr-2" />
              Variantes
            </TabsTrigger>
            <TabsTrigger value="ideas" className="data-[state=active]:bg-electric-cyan/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              Ideas
            </TabsTrigger>
            <TabsTrigger value="improve" className="data-[state=active]:bg-electric-cyan/20">
              <Wand2 className="w-4 h-4 mr-2" />
              Mejorar
            </TabsTrigger>
            <TabsTrigger value="translate" className="data-[state=active]:bg-electric-cyan/20">
              <Languages className="w-4 h-4 mr-2" />
              Traducir
            </TabsTrigger>
          </TabsList>

          {/* Copy Generator */}
          <TabsContent value="copy">
            <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-electric-cyan" />
                  Generador de Copy
                </CardTitle>
                <CardDescription>
                  Genera copies completos para redes sociales con hook, CTA y hashtags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <Label>Tema / Producto</Label>
                    <Input 
                      placeholder="Ej: Black Friday, nuevo producto, evento..."
                      value={copyTopic}
                      onChange={(e) => setCopyTopic(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Plataforma</Label>
                    <Select value={copyPlatform} onValueChange={setCopyPlatform}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tono</Label>
                    <Select value={copyTone} onValueChange={setCopyTone}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profesional">Profesional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="divertido">Divertido</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                        <SelectItem value="inspirador">Inspirador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleGenerateCopy} 
                      disabled={isGenerating || !copyTopic}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Generar Copy
                    </Button>
                  </div>
                </div>

                {copyResult?.copy && (
                  <div className="mt-6 p-4 rounded-lg bg-background/50 border border-electric-cyan/30 space-y-3">
                    <div>
                      <Label className="text-electric-cyan">Hook</Label>
                      <p className="mt-1">{copyResult.copy.hook}</p>
                    </div>
                    <div>
                      <Label className="text-electric-cyan">Cuerpo</Label>
                      <p className="mt-1">{copyResult.copy.body}</p>
                    </div>
                    <div>
                      <Label className="text-electric-cyan">CTA</Label>
                      <p className="mt-1">{copyResult.copy.cta}</p>
                    </div>
                    <div>
                      <Label className="text-electric-cyan">Copy Completo</Label>
                      <div className="mt-1 p-3 bg-card rounded border">
                        {copyResult.copy.fullCopy}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {copyResult.copy.hashtags?.map((tag: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-purple-accent/50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {copyResult.copy.characterCount} caracteres
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variants Generator */}
          <TabsContent value="variants">
            <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-purple-accent" />
                  Generador de Variantes A/B
                </CardTitle>
                <CardDescription>
                  Genera 3 variantes con enfoques diferentes para testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contenido Original</Label>
                  <Textarea 
                    placeholder="Pega tu copy original aquí..."
                    value={variantContent}
                    onChange={(e) => setVariantContent(e.target.value)}
                    rows={4}
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  onClick={handleGenerateVariants} 
                  disabled={isGenerating || !variantContent}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Generar 3 Variantes
                </Button>

                {variantsResult?.variants && (
                  <div className="mt-6 space-y-3">
                    {variantsResult.variants.map((variant: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-background/50 border border-purple-accent/30">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-purple-accent/20">{variant.name}</Badge>
                          <span className="text-xs text-muted-foreground">{variant.approach}</span>
                        </div>
                        <p className="text-sm">{variant.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Rendimiento esperado: {variant.expectedPerformance}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ideas Generator */}
          <TabsContent value="ideas">
            <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Generador de Ideas
                </CardTitle>
                <CardDescription>
                  Genera 5 ideas de contenido con formato, horario y potencial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tema General</Label>
                  <Input 
                    placeholder="Ej: fitness, tecnología, moda, gastronomía..."
                    value={ideasTopic}
                    onChange={(e) => setIdeasTopic(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  onClick={handleGenerateIdeas} 
                  disabled={isGenerating || !ideasTopic}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Lightbulb className="w-4 h-4 mr-2" />
                  )}
                  Generar 5 Ideas
                </Button>

                {ideasResult?.ideas && (
                  <div className="mt-6 space-y-3">
                    {ideasResult.ideas.map((idea: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-background/50 border border-yellow-500/30">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{idea.title}</h4>
                          <Badge 
                            className={
                              idea.engagementPotential?.toLowerCase().includes('alto') 
                                ? 'bg-green-500/20 text-green-400' 
                                : idea.engagementPotential?.toLowerCase().includes('medio')
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-500/20'
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Improve Content */}
          <TabsContent value="improve">
            <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-green-500" />
                  Mejorar Contenido
                </CardTitle>
                <CardDescription>
                  Mejora tu contenido existente con sugerencias de IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contenido a Mejorar</Label>
                  <Textarea 
                    placeholder="Pega el contenido que quieres mejorar..."
                    value={improveContent_}
                    onChange={(e) => setImproveContent(e.target.value)}
                    rows={4}
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  onClick={handleImprove} 
                  disabled={isGenerating || !improveContent_}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 mr-2" />
                  )}
                  Mejorar
                </Button>

                {improveResult?.improved && (
                  <div className="mt-6 p-4 rounded-lg bg-background/50 border border-green-500/30 space-y-3">
                    <div>
                      <Label className="text-green-400">Contenido Mejorado</Label>
                      <div className="mt-1 p-3 bg-card rounded border">
                        {improveResult.improved.content}
                      </div>
                    </div>
                    <div>
                      <Label className="text-green-400">Cambios Realizados</Label>
                      <ul className="mt-1 list-disc list-inside text-sm">
                        {improveResult.improved.changes?.map((change: string, i: number) => (
                          <li key={i}>{change}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="text-green-400">Tips Adicionales</Label>
                      <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground">
                        {improveResult.improved.tips?.map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      Mejora: {improveResult.improved.improvementScore}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Translate */}
          <TabsContent value="translate">
            <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-500" />
                  Traductor con Adaptación Cultural
                </CardTitle>
                <CardDescription>
                  Traduce y adapta culturalmente tu contenido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contenido a Traducir</Label>
                  <Textarea 
                    placeholder="Pega el contenido a traducir..."
                    value={translateContent_}
                    onChange={(e) => setTranslateContent(e.target.value)}
                    rows={4}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label>Idioma Destino</Label>
                  <Select value={translateLang} onValueChange={setTranslateLang}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inglés">Inglés</SelectItem>
                      <SelectItem value="español">Español</SelectItem>
                      <SelectItem value="portugués">Portugués</SelectItem>
                      <SelectItem value="francés">Francés</SelectItem>
                      <SelectItem value="alemán">Alemán</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleTranslate} 
                  disabled={isGenerating || !translateContent_}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Languages className="w-4 h-4 mr-2" />
                  )}
                  Traducir
                </Button>

                {translateResult?.translation && (
                  <div className="mt-6 p-4 rounded-lg bg-background/50 border border-blue-500/30 space-y-3">
                    <div>
                      <Label className="text-blue-400">Traducción</Label>
                      <div className="mt-1 p-3 bg-card rounded border">
                        {translateResult.translation.content}
                      </div>
                    </div>
                    <div>
                      <Label className="text-blue-400">Adaptaciones Culturales</Label>
                      <ul className="mt-1 list-disc list-inside text-sm">
                        {translateResult.translation.adaptations?.map((adapt: string, i: number) => (
                          <li key={i}>{adapt}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="text-blue-400">Notas Culturales</Label>
                      <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground">
                        {translateResult.translation.culturalNotes?.map((note: string, i: number) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorBrainyTestPage;
