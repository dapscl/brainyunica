import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Upload,
  Calendar,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Video,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Sparkles,
  Languages,
  Loader2,
  Copy,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { useContentGenerator } from '@/hooks/useContentGenerator';
import { toast } from 'sonner';

const ShowcaseContentCreatorPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { generateCopy, improveContent, generateVariants, translateContent, isGenerating } = useContentGenerator();
  
  const [copyText, setCopyText] = useState("🚀 Presentamos nuestra última innovación tecnológica. Una solución que revoluciona la forma de trabajar. ¿Listo para el futuro? #Innovación #Tecnología #FuturoDigital");
  const [title, setTitle] = useState("Campaña Innovación 2025");
  const [selectedPlatforms, setSelectedPlatforms] = useState(['facebook', 'instagram']);
  const [variants, setVariants] = useState<any[]>([]);
  const [showVariants, setShowVariants] = useState(false);

  const handleImproveWithAI = async () => {
    const result = await improveContent(copyText, {
      platform: selectedPlatforms[0] || 'instagram'
    });
    
    if (result?.improved) {
      setCopyText(result.improved.content);
      toast.success('Contenido mejorado por CreatorBrainy');
    }
  };

  const handleGenerateNew = async () => {
    const result = await generateCopy({
      topic: title,
      platform: selectedPlatforms[0] || 'instagram',
      tone: 'profesional pero cercano'
    });
    
    if (result?.copy) {
      setCopyText(result.copy.fullCopy);
      toast.success('Nuevo copy generado');
    }
  };

  const handleGenerateVariants = async () => {
    const result = await generateVariants(copyText, {
      platform: selectedPlatforms[0] || 'instagram'
    });
    
    if (result?.variants) {
      setVariants(result.variants);
      setShowVariants(true);
      toast.success('3 variantes A/B generadas');
    }
  };

  const handleTranslate = async () => {
    const result = await translateContent(copyText, 'inglés');
    
    if (result?.translation) {
      setCopyText(result.translation.content);
      toast.success('Traducido al inglés');
    }
  };

  const selectVariant = (variant: any) => {
    setCopyText(variant.content);
    setShowVariants(false);
    toast.success(`Variante "${variant.name}" seleccionada`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/brands/${slug}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Workflow
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Crear Nuevo Contenido</h1>
            <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500">
              <Sparkles className="w-3 h-3 mr-1" />
              CreatorBrainy Activo
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Diseña y programa tu próxima publicación con IA integrada
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Contenido</CardTitle>
                <CardDescription>
                  Información principal de tu publicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título de la Campaña</Label>
                  <Input 
                    id="title" 
                    placeholder="Ej: Lanzamiento Producto Q4" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="copy">Copy de Publicación</Label>
                  <Textarea 
                    id="copy" 
                    placeholder="Escribe el texto de tu publicación..." 
                    rows={6}
                    value={copyText}
                    onChange={(e) => setCopyText(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleImproveWithAI}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}
                      Mejorar con IA
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleGenerateNew}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 mr-1" />
                      )}
                      Generar Nuevo
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleGenerateVariants}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Copy className="w-3 h-3 mr-1" />
                      )}
                      Variantes A/B
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleTranslate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Languages className="w-3 h-3 mr-1" />
                      )}
                      Traducir
                    </Button>
                  </div>
                </div>

                {/* Variants Panel */}
                {showVariants && variants.length > 0 && (
                  <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Variantes A/B Testing
                      </h4>
                      <Button size="sm" variant="ghost" onClick={() => setShowVariants(false)}>
                        Cerrar
                      </Button>
                    </div>
                    {variants.map((variant, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-background rounded border hover:border-primary cursor-pointer transition-colors"
                        onClick={() => selectVariant(variant)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{variant.name}</Badge>
                          <span className="text-xs text-muted-foreground">{variant.approach}</span>
                        </div>
                        <p className="text-sm">{variant.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Label>Formato de Contenido</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <button className="p-4 border-2 border-primary bg-primary/5 rounded-lg flex flex-col items-center gap-2 hover:bg-primary/10 transition-colors">
                      <Video className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium">Video</span>
                    </button>
                    <button className="p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted transition-colors">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-sm font-medium">Imagen</span>
                    </button>
                    <button className="p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted transition-colors">
                      <Layers className="w-6 h-6" />
                      <span className="text-sm font-medium">Carrusel</span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Medios</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arrastra archivos o haz clic para subir
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Video (MP4, MOV), Imágenes (JPG, PNG) hasta 100MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opciones Avanzadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Promocionar Contenido</p>
                      <p className="text-xs text-muted-foreground">Boost con presupuesto publicitario</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Presupuesto de Promoción</Label>
                  <Input type="number" placeholder="$" defaultValue="300" />
                  <p className="text-xs text-muted-foreground">
                    Alcance estimado: 15K-22K personas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Target de Audiencia</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Edad: 25-45</Badge>
                    <Badge>Intereses: Tecnología</Badge>
                    <Badge>Ubicación: México</Badge>
                    <Button size="sm" variant="outline">+ Editar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plataformas</CardTitle>
                <CardDescription>Selecciona donde publicar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '' },
                  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
                ].map(platform => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <div 
                      key={platform.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, platform.id]);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <platform.icon className={`w-5 h-5 ${platform.color}`} />
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4" 
                        checked={isSelected}
                        readOnly
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Fecha de Publicación</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Input type="date" defaultValue="2024-11-15" />
                  </div>
                </div>

                <div>
                  <Label>Hora</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    Mejor hora sugerida por IA
                  </p>
                  <Badge variant="outline" className="bg-green-500/10">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Miércoles 9:00 AM (87% engagement)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge className="w-full justify-center py-2">Borrador</Badge>
                <div className="space-y-2">
                  <Button className="w-full">Programar Publicación</Button>
                  <Button variant="outline" className="w-full">Guardar Borrador</Button>
                  <Button variant="ghost" className="w-full">Vista Previa</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseContentCreatorPage;
