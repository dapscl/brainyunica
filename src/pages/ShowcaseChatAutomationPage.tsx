import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, MessageSquare, Zap, Users, TrendingUp, Play, Settings, Copy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import WhatsAppProjectManager from '@/components/showcase/WhatsAppProjectManager';

const ShowcaseChatAutomationPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Mock flow data
  const flows = [
    {
      id: 1,
      name: 'Welcome Message',
      status: 'active',
      trigger: 'Keyword: "Hola"',
      conversions: 145,
      engagement: 89
    },
    {
      id: 2,
      name: 'Product Inquiry',
      status: 'active',
      trigger: 'Keyword: "Producto"',
      conversions: 87,
      engagement: 92
    },
    {
      id: 3,
      name: 'Pricing Info',
      status: 'draft',
      trigger: 'Keyword: "Precio"',
      conversions: 0,
      engagement: 0
    }
  ];

  const stats = [
    { label: 'Total Flows', value: '12', icon: MessageSquare },
    { label: 'Active Flows', value: '8', icon: Zap },
    { label: 'Leads Captured', value: '1,243', icon: Users },
    { label: 'Conversion Rate', value: '34%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/showcase/brands/${slug}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>

        {/* WhatsApp Project Manager Section */}
        <WhatsAppProjectManager />

        {/* Additional Flow Builder Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Constructor Visual de Flujos</h2>
              <p className="text-muted-foreground mt-1">Complementa la gestión de WhatsApp con flujos avanzados</p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Crear Nuevo Flujo
            </Button>
          </div>

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
            {/* Flows List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Flujos de Automatización</CardTitle>
                  <CardDescription>Gestiona tus respuestas automáticas y flujos de conversación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {flows.map((flow) => (
                    <div key={flow.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{flow.name}</h3>
                            <Badge variant={flow.status === 'active' ? 'default' : 'secondary'}>
                              {flow.status === 'active' ? 'Activo' : 'Borrador'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{flow.trigger}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Conversiones</p>
                          <p className="text-lg font-semibold">{flow.conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="text-lg font-semibold">{flow.engagement}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Visual Flow Builder Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Constructor Visual</CardTitle>
                  <CardDescription>Diseña flujos conversacionales sin código</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Arrastra y Suelta Bloques</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Crea flujos complejos conectando triggers, mensajes, condiciones y acciones
                    </p>
                    <Button>
                      Abrir Constructor Visual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Comment → DM Automation */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg">Comment → DM Automation</CardTitle>
                  <CardDescription>Convierte comentarios en conversaciones privadas automáticamente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Instagram Comments</span>
                      <Badge variant="default">Activo</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Keywords detectadas: precio, disponible, interesado
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Auto-respuestas</p>
                        <p className="font-semibold">127</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversiones</p>
                        <p className="font-semibold">34</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full gap-2 mt-3">
                    <Settings className="w-4 h-4" />
                    Configurar Automatizaciones
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="w-4 h-4" />
                    Crear desde Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Copy className="w-4 h-4" />
                    Duplicar Flujo Existente
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="w-4 w-4" />
                    Importar desde Archivo
                  </Button>
                </CardContent>
              </Card>

              {/* Integration Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Canales Activos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Facebook Messenger</span>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Instagram DM</span>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WhatsApp</span>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Telegram</span>
                    <Badge variant="secondary">Desconectado</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseChatAutomationPage;