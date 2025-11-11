import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Target,
  DollarSign,
  Calendar,
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  Facebook,
  Linkedin,
  Sparkles,
  MapPin,
  Briefcase,
  Heart,
  Clock
} from 'lucide-react';

const ShowcaseCampaignCreatorPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

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
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crear Nueva Campaña Publicitaria</h1>
          <p className="text-muted-foreground">
            Configura tu campaña con targeting inteligente y optimización automática
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Campaign Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Campaña</CardTitle>
                <CardDescription>
                  Detalles generales y objetivo de la campaña
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name">Nombre de Campaña</Label>
                  <Input 
                    id="campaign-name" 
                    placeholder="Ej: Lanzamiento Producto Q1 2025" 
                    defaultValue="Campaña Lead Generation - Tech Solutions"
                  />
                </div>

                <div>
                  <Label>Objetivo de Campaña</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button className="p-4 border-2 border-primary bg-primary/5 rounded-lg flex flex-col items-center gap-2">
                      <Target className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium">Conversiones</span>
                    </button>
                    <button className="p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted">
                      <Eye className="w-6 h-6" />
                      <span className="text-sm font-medium">Alcance</span>
                    </button>
                    <button className="p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted">
                      <MousePointerClick className="w-6 h-6" />
                      <span className="text-sm font-medium">Tráfico</span>
                    </button>
                    <button className="p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted">
                      <Heart className="w-6 h-6" />
                      <span className="text-sm font-medium">Engagement</span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe el objetivo y estrategia de tu campaña..." 
                    rows={3}
                    defaultValue="Campaña enfocada en generar leads calificados para soluciones B2B tech. Target: Directores de IT y CTOs en empresas medianas."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Presupuesto y Duración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Presupuesto Total</Label>
                    <div className="relative mt-2">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="budget" 
                        type="number" 
                        className="pl-9" 
                        placeholder="2000"
                        defaultValue="2000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="daily-budget">Presupuesto Diario</Label>
                    <div className="relative mt-2">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="daily-budget" 
                        type="number" 
                        className="pl-9" 
                        placeholder="100"
                        defaultValue="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Fecha de Inicio</Label>
                    <Input id="start-date" type="date" defaultValue="2024-11-15" className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="end-date">Fecha de Fin</Label>
                    <Input id="end-date" type="date" defaultValue="2024-12-15" className="mt-2" />
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Predicción de Resultados</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Con este presupuesto, estimamos: 45K-62K impresiones, 3.2K-4.8K clics, 280-420 conversiones
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audiencia y Targeting</CardTitle>
                <CardDescription>
                  Define tu público objetivo con precisión
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Demografía</Label>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="age-min" className="text-xs">Edad Mínima</Label>
                      <Input id="age-min" type="number" defaultValue="25" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="age-max" className="text-xs">Edad Máxima</Label>
                      <Input id="age-max" type="number" defaultValue="55" className="mt-1" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ubicaciones
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>México 🇲🇽</Badge>
                    <Badge>Ciudad de México</Badge>
                    <Badge>Monterrey</Badge>
                    <Badge>Guadalajara</Badge>
                    <Button size="sm" variant="outline">+ Agregar</Button>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Intereses Profesionales
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>Tecnología</Badge>
                    <Badge>Software Development</Badge>
                    <Badge>Cloud Computing</Badge>
                    <Badge>Digital Transformation</Badge>
                    <Badge>IT Management</Badge>
                    <Button size="sm" variant="outline">+ Agregar</Button>
                  </div>
                </div>

                <div>
                  <Label>Cargos Laborales (LinkedIn)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>CTO</Badge>
                    <Badge>IT Director</Badge>
                    <Badge>VP Technology</Badge>
                    <Badge>Tech Lead</Badge>
                    <Button size="sm" variant="outline">+ Agregar</Button>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Tamaño de Audiencia</span>
                    <Badge variant="outline" className="bg-green-500/10">
                      <Users className="w-3 h-3 mr-1" />
                      Óptimo
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimado</span>
                      <span className="font-semibold">125K - 180K personas</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plataformas de Publicidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold">Meta Ads</p>
                      <p className="text-xs text-muted-foreground">Facebook + Instagram</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Presupuesto:</span>
                      <span className="font-medium">$1,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPM Estimado:</span>
                      <span className="font-medium">$8.50</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Linkedin className="w-6 h-6 text-blue-700" />
                    <div className="flex-1">
                      <p className="font-semibold">LinkedIn Ads</p>
                      <p className="text-xs text-muted-foreground">B2B Professional Network</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Presupuesto:</span>
                      <span className="font-medium">$800</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPM Estimado:</span>
                      <span className="font-medium">$12.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm">Auto-optimización IA</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">Horarios Inteligentes</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm">A/B Testing Automático</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Proyección de Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ROAS Esperado:</span>
                    <span className="font-bold text-green-600">3.8x - 4.5x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversiones:</span>
                    <span className="font-semibold">280 - 420</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CPA Estimado:</span>
                    <span className="font-semibold">$4.76 - $7.14</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="lg">
                  Lanzar Campaña
                </Button>
                <Button variant="outline" className="w-full">
                  Guardar Borrador
                </Button>
                <Button variant="ghost" className="w-full">
                  Previsualizar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseCampaignCreatorPage;
