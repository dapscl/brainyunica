import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Video, Wand2, Play, Download, Copy, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

const ShowcaseVideoGeneratorPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('');

  const generatedVideos = [
    {
      id: 1,
      thumbnail: '/demo-tech-product-1.jpg',
      title: 'Tech Product Demo',
      duration: '0:45',
      avatar: 'Emma',
      status: 'completed',
      views: 1243,
      engagement: '8.5%'
    },
    {
      id: 2,
      thumbnail: '/demo-fitness-1.jpg',
      title: 'Fitness Challenge Promo',
      duration: '0:30',
      avatar: 'Marcus',
      status: 'completed',
      views: 2891,
      engagement: '12.3%'
    },
    {
      id: 3,
      thumbnail: '/demo-eco-product-1.jpg',
      title: 'Eco Product Launch',
      duration: '0:38',
      avatar: 'Sofia',
      status: 'processing',
      views: 0,
      engagement: '0%'
    }
  ];

  const avatarOptions = [
    { name: 'Emma', style: 'Profesional', tone: 'Confiable' },
    { name: 'Marcus', style: 'Energético', tone: 'Motivacional' },
    { name: 'Sofia', style: 'Amigable', tone: 'Conversacional' },
    { name: 'David', style: 'Ejecutivo', tone: 'Autoritario' }
  ];

  const stats = [
    { label: 'Videos Generados', value: '24', icon: Video },
    { label: 'Tiempo Ahorrado', value: '18h', icon: TrendingUp },
    { label: 'Engagement Promedio', value: '9.2%', icon: Sparkles },
    { label: 'ROI Promedio', value: '3.8x', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/brands/${slug}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Generador de Video con IA</h1>
              <p className="text-muted-foreground mt-1">
                Convierte URLs en videos profesionales con avatares AI en minutos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>{stat.label}</CardDescription>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Generator Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wand2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Crear Nuevo Video</CardTitle>
                    <CardDescription className="text-base">
                      Pega una URL o describe tu video y déjanos hacer la magia
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL del Producto o Página Web</Label>
                  <Input 
                    id="url"
                    placeholder="https://ejemplo.com/producto"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    La IA extraerá automáticamente información del producto
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Descripción del Video (Opcional)</Label>
                  <Textarea 
                    id="prompt"
                    placeholder="Ej: Video dinámico de 30 segundos destacando características principales con tono profesional..."
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar AI</Label>
                    <Select defaultValue="emma">
                      <SelectTrigger id="avatar">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {avatarOptions.map((avatar) => (
                          <SelectItem key={avatar.name} value={avatar.name.toLowerCase()}>
                            {avatar.name} - {avatar.style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 segundos</SelectItem>
                        <SelectItem value="30">30 segundos</SelectItem>
                        <SelectItem value="45">45 segundos</SelectItem>
                        <SelectItem value="60">60 segundos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Estilo de Video</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profesional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="energetic">Energético</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full gap-2" size="lg">
                  <Wand2 className="w-4 h-4" />
                  Generar Video con IA
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Tiempo estimado de generación: 3-5 minutos
                </p>
              </CardContent>
            </Card>

            {/* Generated Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Videos Generados</CardTitle>
                <CardDescription>Tu biblioteca de videos creados con IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedVideos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{video.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Avatar: {video.avatar} • {video.duration}
                            </p>
                          </div>
                          <Badge variant={video.status === 'completed' ? 'default' : 'secondary'}>
                            {video.status === 'completed' ? 'Completado' : 'Procesando...'}
                          </Badge>
                        </div>
                        {video.status === 'completed' && (
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Play className="w-3 h-3 mr-1" />
                                Ver
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3 mr-1" />
                                Descargar
                              </Button>
                              <Button variant="outline" size="sm">
                                <Copy className="w-3 h-3 mr-1" />
                                Duplicar
                              </Button>
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground ml-auto">
                              <span>{video.views} vistas</span>
                              <span>{video.engagement} engagement</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avatares Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {avatarOptions.map((avatar) => (
                  <div key={avatar.name} className="border rounded-lg p-3 hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold">{avatar.name[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{avatar.name}</h4>
                        <p className="text-xs text-muted-foreground">{avatar.style}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Tono: {avatar.tone}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips para Mejores Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      URLs con imágenes de alta calidad generan mejores resultados
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Sé específico en la descripción para resultados más precisos
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Videos de 30-45s tienen mejor engagement en redes sociales
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testing & Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Testing Automático</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Crea variantes automáticas de tu video para A/B testing
                </p>
                <Button variant="outline" className="w-full">
                  Generar Variantes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseVideoGeneratorPage;
