import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  FileText,
  Image,
  Video,
  MessageSquare,
  Plus,
  Copy,
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle2,
  Pencil,
  Trash2,
  LayoutTemplate
} from 'lucide-react';

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'post' | 'story' | 'reel' | 'carousel' | 'thread' | 'article';
  platform: string[];
  structure: string;
  variables: string[];
  example?: string;
}

const defaultTemplates: ContentTemplate[] = [
  {
    id: 'post-educativo',
    name: 'Post Educativo',
    description: 'Comparte conocimiento con tu audiencia',
    category: 'post',
    platform: ['instagram', 'facebook', 'linkedin'],
    structure: `🎯 [GANCHO INICIAL]

💡 [PUNTO PRINCIPAL]

✅ [BENEFICIO 1]
✅ [BENEFICIO 2]
✅ [BENEFICIO 3]

👉 [LLAMADA A LA ACCIÓN]

[HASHTAGS]`,
    variables: ['GANCHO INICIAL', 'PUNTO PRINCIPAL', 'BENEFICIO 1', 'BENEFICIO 2', 'BENEFICIO 3', 'LLAMADA A LA ACCIÓN', 'HASHTAGS'],
    example: '🎯 ¿Sabías que el 80% de las decisiones de compra son emocionales?\n\n💡 El copywriting efectivo conecta con las emociones de tu audiencia.\n\n✅ Aumenta conversiones\n✅ Genera confianza\n✅ Diferencia tu marca\n\n👉 Guarda este post para tu próxima campaña.\n\n#Marketing #Copywriting #Ventas'
  },
  {
    id: 'story-pregunta',
    name: 'Story Interactiva',
    description: 'Genera engagement con preguntas',
    category: 'story',
    platform: ['instagram', 'facebook'],
    structure: `[PREGUNTA PROVOCADORA]

A) [OPCIÓN 1]
B) [OPCIÓN 2]

🔥 Responde en las reacciones`,
    variables: ['PREGUNTA PROVOCADORA', 'OPCIÓN 1', 'OPCIÓN 2'],
    example: '¿Cuál es tu mayor reto en marketing?\n\nA) Generar contenido\nB) Conseguir leads\n\n🔥 Responde en las reacciones'
  },
  {
    id: 'reel-hook',
    name: 'Reel con Hook',
    description: 'Captura atención en los primeros segundos',
    category: 'reel',
    platform: ['instagram', 'tiktok'],
    structure: `🎬 HOOK (0-3s): [FRASE IMPACTANTE]

📍 PROBLEMA (3-10s): [DESCRIBE EL PROBLEMA]

💡 SOLUCIÓN (10-25s): [TU SOLUCIÓN]

🎯 CTA (25-30s): [LLAMADA A LA ACCIÓN]

---
CAPTION:
[DESCRIPCIÓN BREVE]

[HASHTAGS]`,
    variables: ['FRASE IMPACTANTE', 'DESCRIBE EL PROBLEMA', 'TU SOLUCIÓN', 'LLAMADA A LA ACCIÓN', 'DESCRIPCIÓN BREVE', 'HASHTAGS'],
    example: '🎬 HOOK: "Esto está matando tu engagement..."\n\n📍 PROBLEMA: Publicas sin estrategia y sin entender a tu audiencia.\n\n💡 SOLUCIÓN: Usa datos + creatividad. Analiza qué funciona y replica.\n\n🎯 CTA: Sígueme para más tips.\n\n---\nCAPTION:\n3 errores que destruyen tu engagement 👇\n\n#ReelsVirales #MarketingDigital'
  },
  {
    id: 'carousel-lista',
    name: 'Carrusel Lista',
    description: 'Contenido en formato slide',
    category: 'carousel',
    platform: ['instagram', 'linkedin'],
    structure: `SLIDE 1 (PORTADA):
[TÍTULO LLAMATIVO]
[SUBTÍTULO]

SLIDE 2-6:
[PUNTO #N]
[EXPLICACIÓN BREVE]

SLIDE FINAL (CTA):
[RESUMEN]
[LLAMADA A LA ACCIÓN]

---
CAPTION:
[DESCRIPCIÓN]
[HASHTAGS]`,
    variables: ['TÍTULO LLAMATIVO', 'SUBTÍTULO', 'PUNTO #N', 'EXPLICACIÓN BREVE', 'RESUMEN', 'LLAMADA A LA ACCIÓN', 'DESCRIPCIÓN', 'HASHTAGS'],
  },
  {
    id: 'thread-twitter',
    name: 'Thread/Hilo',
    description: 'Contenido largo en formato hilo',
    category: 'thread',
    platform: ['twitter', 'linkedin'],
    structure: `1/ [GANCHO INICIAL - TWEET PRINCIPAL]

2/ [CONTEXTO O PROBLEMA]

3/ [PUNTO 1]

4/ [PUNTO 2]

5/ [PUNTO 3]

6/ [CONCLUSIÓN]

7/ [CTA + RETWEET REQUEST]`,
    variables: ['GANCHO INICIAL', 'CONTEXTO O PROBLEMA', 'PUNTO 1', 'PUNTO 2', 'PUNTO 3', 'CONCLUSIÓN', 'CTA'],
  },
  {
    id: 'articulo-blog',
    name: 'Artículo Blog',
    description: 'Contenido largo para blog o LinkedIn',
    category: 'article',
    platform: ['linkedin', 'blog'],
    structure: `# [TÍTULO SEO]

## Introducción
[GANCHO + PROBLEMA + PROMESA]

## [SECCIÓN 1]
[CONTENIDO]

## [SECCIÓN 2]
[CONTENIDO]

## [SECCIÓN 3]
[CONTENIDO]

## Conclusión
[RESUMEN + CTA]

---
META DESCRIPTION: [160 CARACTERES]
KEYWORDS: [PALABRAS CLAVE]`,
    variables: ['TÍTULO SEO', 'GANCHO', 'PROBLEMA', 'PROMESA', 'SECCIÓN 1', 'SECCIÓN 2', 'SECCIÓN 3', 'RESUMEN', 'CTA', 'META DESCRIPTION', 'KEYWORDS'],
  }
];

const categoryIcons: Record<string, React.ReactNode> = {
  post: <FileText className="w-4 h-4" />,
  story: <Image className="w-4 h-4" />,
  reel: <Video className="w-4 h-4" />,
  carousel: <LayoutTemplate className="w-4 h-4" />,
  thread: <MessageSquare className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
};

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-3 h-3" />,
  facebook: <Facebook className="w-3 h-3" />,
  twitter: <Twitter className="w-3 h-3" />,
  linkedin: <Linkedin className="w-3 h-3" />,
  tiktok: <Video className="w-3 h-3" />,
  blog: <FileText className="w-3 h-3" />,
};

interface ContentTemplatesPanelProps {
  onSelectTemplate?: (template: ContentTemplate) => void;
  onGenerateFromTemplate?: (template: ContentTemplate, topic: string) => void;
}

const ContentTemplatesPanel = ({ 
  onSelectTemplate, 
  onGenerateFromTemplate 
}: ContentTemplatesPanelProps) => {
  const [templates] = useState<ContentTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [generationTopic, setGenerationTopic] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'post', 'story', 'reel', 'carousel', 'thread', 'article'];
  
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Estructura copiada al portapapeles');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const handleSelectTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handleGenerate = () => {
    if (!selectedTemplate || !generationTopic.trim()) {
      toast.error('Ingresa un tema para generar contenido');
      return;
    }
    if (onGenerateFromTemplate) {
      onGenerateFromTemplate(selectedTemplate, generationTopic);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-purple-400" />
          Templates de Contenido
        </h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="capitalize gap-2"
          >
            {cat !== 'all' && categoryIcons[cat]}
            {cat === 'all' ? 'Todos' : cat}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-card/50 border-border/50 hover:border-purple-500/30 transition-all h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      {categoryIcons[template.category]}
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs capitalize mt-1">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {template.platform.map(p => (
                    <Badge key={p} variant="outline" className="text-xs gap-1">
                      {platformIcons[p]}
                      {p}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <FileText className="w-3 h-3" />
                        Ver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {categoryIcons[template.category]}
                          {template.name}
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh]">
                        <div className="space-y-4 p-1">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Estructura:</h4>
                            <div className="bg-muted/30 rounded-lg p-4 relative">
                              <pre className="text-sm whitespace-pre-wrap font-mono">
                                {template.structure}
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(template.structure, template.id)}
                              >
                                {copiedId === template.id ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {template.example && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Ejemplo:</h4>
                              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                                <pre className="text-sm whitespace-pre-wrap">
                                  {template.example}
                                </pre>
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="text-sm font-medium mb-2">Variables a completar:</h4>
                            <div className="flex flex-wrap gap-2">
                              {template.variables.map(v => (
                                <Badge key={v} variant="outline" className="text-xs">
                                  {v}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {onGenerateFromTemplate && (
                            <div className="pt-4 border-t border-border/50">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                Generar con IA
                              </h4>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Tema o producto (ej: curso de marketing digital)"
                                  value={generationTopic}
                                  onChange={(e) => setGenerationTopic(e.target.value)}
                                  className="flex-1"
                                />
                                <Button onClick={handleGenerate} className="gap-2">
                                  <Sparkles className="w-4 h-4" />
                                  Generar
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(template.structure, template.id)}
                  >
                    {copiedId === template.id ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContentTemplatesPanel;
