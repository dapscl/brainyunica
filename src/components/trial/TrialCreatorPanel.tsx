import { useState, useRef } from 'react';
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
  CheckCircle2,
  Check,
  Pencil,
  Upload,
  Image as ImageIcon,
  X,
  Search,
  TrendingUp,
  Target,
  Link,
  FileText
} from 'lucide-react';
import { useContentGenerator } from '@/hooks/useContentGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BrandAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  contentIdeas: string[];
}

interface SeoAnalysis {
  foundKeywords: string[];
  missingKeywords: string[];
  seoOpportunities: string[];
  keywordAlignment: string;
}

interface BrandProfile {
  brandName: string;
  tone: string;
  style: string;
  colors: string[];
  keywords: string[];
  personality: string;
  analysis?: BrandAnalysis;
  seo?: SeoAnalysis;
}

interface TrialCreatorPanelProps {
  brandProfile: BrandProfile;
  onGoToDashboard: () => void;
}

interface AcceptedContent {
  type: string;
  content: any;
  acceptedAt: Date;
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Customizable tone/style from brand profile
  const [selectedTone, setSelectedTone] = useState(brandProfile.tone || 'profesional');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');

  // Copy Generator State
  const [copyTopic, setCopyTopic] = useState('');
  const [copyReferenceUrl, setCopyReferenceUrl] = useState('');
  const [copyReferenceFile, setCopyReferenceFile] = useState<File | null>(null);
  const [copyReferenceText, setCopyReferenceText] = useState('');
  const [copyResult, setCopyResult] = useState<any>(null);
  const [copyAccepted, setCopyAccepted] = useState(false);
  const [copyEditing, setCopyEditing] = useState(false);
  const [editedCopy, setEditedCopy] = useState('');

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

  // Image States
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Accepted content library
  const [acceptedContents, setAcceptedContents] = useState<AcceptedContent[]>([]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target!.result as string]);
          toast.success(`Imagen "${file.name}" cargada`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Generate reference image with AI
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Ingresa una descripción para la imagen');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const brandContext = `Marca: ${brandProfile.brandName}. Estilo: ${brandProfile.style}. Colores: ${brandProfile.colors.join(', ')}. Personalidad: ${brandProfile.personality}`;
      
      const { data, error } = await supabase.functions.invoke('image-generator', {
        body: { prompt: imagePrompt, brandContext }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setGeneratedImages(prev => [...prev, data.imageUrl]);
        toast.success('Imagen de referencia generada');
      } else {
        toast.error(data?.message || 'No se pudo generar la imagen');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'Error generando imagen');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Accept content
  const handleAcceptContent = (type: string, content: any) => {
    setAcceptedContents(prev => [...prev, { type, content, acceptedAt: new Date() }]);
    if (type === 'copy') setCopyAccepted(true);
    toast.success('Contenido aceptado y guardado');
  };

  // Start editing
  const handleStartEdit = (type: string, content: string) => {
    if (type === 'copy') {
      setCopyEditing(true);
      setEditedCopy(content);
    }
  };

  // Save edit
  const handleSaveEdit = (type: string) => {
    if (type === 'copy' && copyResult) {
      setCopyResult({ 
        ...copyResult, 
        copy: { ...copyResult.copy, fullCopy: editedCopy } 
      });
      setCopyEditing(false);
      toast.success('Cambios guardados');
    }
  };

  // Remove image
  const handleRemoveImage = (index: number, type: 'uploaded' | 'generated') => {
    if (type === 'uploaded') {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setGeneratedImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const brandContext = `Marca: ${brandProfile.brandName}. Estilo: ${brandProfile.style}. Personalidad: ${brandProfile.personality}. Keywords: ${brandProfile.keywords.join(', ')}`;

  // Handle reference file upload for copy generator
  const handleReferenceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCopyReferenceFile(file);
    
    // Read text content if it's a text file
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCopyReferenceText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    } else {
      // For PDF or other files, just note that it's uploaded
      setCopyReferenceText(`[Archivo adjunto: ${file.name}]`);
    }
    toast.success(`Archivo "${file.name}" cargado como referencia`);
  };

  const handleGenerateCopy = async () => {
    // Build additional context from reference URL and file
    let additionalContext = '';
    if (copyReferenceUrl) {
      additionalContext += `\n\nURL de referencia del producto/servicio: ${copyReferenceUrl}`;
    }
    if (copyReferenceText) {
      additionalContext += `\n\nInformación adicional del producto/ficha técnica:\n${copyReferenceText.substring(0, 2000)}`;
    }

    const result = await generateCopy({
      topic: copyTopic,
      platform: selectedPlatform,
      tone: selectedTone,
      context: brandContext + additionalContext
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
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-accent to-electric-cyan flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Análisis de Tono y Estilo
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  IA Completado
                </Badge>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {brandProfile.analysis?.summary || getBrandAnalysisSummary().split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-electric-cyan">{part}</strong> : part
                )}
              </p>
            </div>
          </div>

          {/* Detailed Analysis Table */}
          {brandProfile.analysis && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-purple-accent/20">
              {/* Strengths */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Fortalezas
                </h4>
                <ul className="space-y-1">
                  {brandProfile.analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Áreas de Mejora
                </h4>
                <ul className="space-y-1">
                  {brandProfile.analysis.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-electric-cyan flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Recomendaciones
                </h4>
                <ul className="space-y-1">
                  {brandProfile.analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-electric-cyan mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Analysis Section */}
      {brandProfile.seo && (
        <Card className="bg-gradient-to-br from-green-500/10 to-electric-cyan/10 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-electric-cyan flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  Análisis SEO & Keywords
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    IA Completado
                  </Badge>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {brandProfile.seo.keywordAlignment}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-green-500/20">
              {/* Found Keywords */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Keywords Encontradas
                </h4>
                <div className="flex flex-wrap gap-1">
                  {brandProfile.seo.foundKeywords.slice(0, 6).map((keyword, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Keywords Faltantes
                </h4>
                <div className="flex flex-wrap gap-1">
                  {brandProfile.seo.missingKeywords.slice(0, 6).map((keyword, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Opportunities */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-electric-cyan flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Oportunidades SEO
                </h4>
                <ul className="space-y-1">
                  {brandProfile.seo.seoOpportunities.map((opp, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-electric-cyan mt-1">•</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <TabsList className="grid w-full grid-cols-6 bg-card/30 backdrop-blur-sm border border-electric-cyan/20 h-12">
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
          <TabsTrigger value="images" className="text-foreground/70 data-[state=active]:text-pink-400 data-[state=active]:bg-pink-400/20">
            <ImageIcon className="w-4 h-4 mr-2" />
            Imágenes
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

              {/* Reference URL */}
              <div>
                <Label className="text-foreground flex items-center gap-2">
                  <Link className="w-4 h-4 text-electric-cyan" />
                  URL de Referencia (opcional)
                </Label>
                <Input 
                  placeholder="https://ejemplo.com/producto o ficha-tecnica"
                  value={copyReferenceUrl}
                  onChange={(e) => setCopyReferenceUrl(e.target.value)}
                  className="bg-card/30 border-electric-cyan/20 text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Agrega un link a la página del producto o ficha técnica para un copy más preciso
                </p>
              </div>

              {/* Reference File Upload */}
              <div>
                <Label className="text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-accent" />
                  Ficha Técnica / PDF (opcional)
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleReferenceFileUpload}
                    className="bg-card/30 border-electric-cyan/20 text-foreground file:bg-purple-accent/20 file:text-purple-accent file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer"
                  />
                  {copyReferenceFile && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setCopyReferenceFile(null);
                        setCopyReferenceText('');
                      }}
                      className="text-muted-foreground hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {copyReferenceFile && (
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {copyReferenceFile.name} cargado
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Sube un PDF, ficha técnica o documento con información del producto
                </p>
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
                    {copyEditing ? (
                      <div className="mt-1 space-y-2">
                        <Textarea
                          value={editedCopy}
                          onChange={(e) => setEditedCopy(e.target.value)}
                          rows={6}
                          className="bg-card/50 border-electric-cyan/30 text-foreground"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit('copy')} className="bg-green-500 hover:bg-green-600">
                            <Check className="w-4 h-4 mr-1" /> Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setCopyEditing(false)} className="border-border/50">
                            <X className="w-4 h-4 mr-1" /> Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 p-3 bg-card/50 rounded border border-electric-cyan/10 text-foreground whitespace-pre-wrap">
                        {copyResult.copy.fullCopy}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {copyResult.copy.hashtags?.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-purple-accent/50 text-purple-accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Accept / Edit Buttons */}
                  {!copyAccepted && !copyEditing && (
                    <div className="flex gap-3 pt-4 border-t border-electric-cyan/20">
                      <Button 
                        onClick={() => handleAcceptContent('copy', copyResult.copy)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleStartEdit('copy', copyResult.copy.fullCopy)}
                        className="border-electric-cyan/50 text-electric-cyan hover:bg-electric-cyan/10"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  )}
                  {copyAccepted && (
                    <div className="flex items-center gap-2 pt-4 border-t border-green-500/30">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-green-400 font-medium">Contenido aceptado</span>
                    </div>
                  )}
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

        {/* Images - Upload and Generate */}
        <TabsContent value="images">
          <Card className="bg-card/30 backdrop-blur-sm border border-pink-400/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ImageIcon className="w-5 h-5 text-pink-400" />
                Imágenes y Referencias
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Carga tus imágenes o genera referencias visuales con IA para {brandProfile.brandName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Section */}
              <div className="space-y-3">
                <Label className="text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Cargar Imágenes o Logos
                </Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-pink-400/30 rounded-lg p-6 text-center cursor-pointer hover:border-pink-400/50 hover:bg-pink-400/5 transition-colors"
                >
                  <Upload className="w-8 h-8 mx-auto text-pink-400/50 mb-2" />
                  <p className="text-muted-foreground">Click para seleccionar imágenes</p>
                  <p className="text-xs text-muted-foreground/70">PNG, JPG, WEBP hasta 10MB</p>
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`Uploaded ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-pink-400/30"
                        />
                        <button
                          onClick={() => handleRemoveImage(idx, 'uploaded')}
                          className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Image Generation Section */}
              <div className="space-y-3 pt-4 border-t border-pink-400/20">
                <Label className="text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generar Imágenes de Referencia con IA
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ej: imagen de producto minimalista, banner promocional, foto lifestyle..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="bg-card/30 border-pink-400/20 text-foreground placeholder:text-muted-foreground flex-1"
                  />
                  <Button 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="bg-gradient-to-r from-pink-500 to-purple-accent hover:opacity-90 text-white font-semibold"
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  La IA generará imágenes de referencia basadas en el estilo y colores de tu marca
                </p>

                {generatedImages.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                  >
                    {generatedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`Generated ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-purple-accent/30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                            <Badge className="bg-purple-accent/80 text-white text-xs">
                              IA Generada
                            </Badge>
                            <button
                              onClick={() => handleRemoveImage(idx, 'generated')}
                              className="bg-red-500/80 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Quick suggestions */}
              <div className="pt-4 border-t border-pink-400/20">
                <Label className="text-muted-foreground text-sm mb-2 block">Sugerencias rápidas:</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    `Foto de producto ${brandProfile.brandName}`,
                    'Banner promocional moderno',
                    'Imagen lifestyle para Instagram',
                    'Gráfico para stories'
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImagePrompt(suggestion)}
                      className="px-3 py-1 text-xs bg-pink-400/10 text-pink-400 rounded-full border border-pink-400/30 hover:bg-pink-400/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
