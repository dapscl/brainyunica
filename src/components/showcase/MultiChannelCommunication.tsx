import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Smartphone, Send, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

const MultiChannelCommunication = () => {
  const channels = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      status: 'active',
      sent: 1243,
      opened: 1156,
      clicked: 487,
      openRate: '93%',
      clickRate: '39%'
    },
    {
      name: 'Email',
      icon: Mail,
      status: 'active',
      sent: 3421,
      opened: 2053,
      clicked: 618,
      openRate: '60%',
      clickRate: '18%'
    },
    {
      name: 'SMS',
      icon: Smartphone,
      status: 'active',
      sent: 892,
      opened: 847,
      clicked: 312,
      openRate: '95%',
      clickRate: '35%'
    }
  ];

  const campaigns = [
    {
      name: 'Black Friday Promo',
      channels: ['WhatsApp', 'Email', 'SMS'],
      sent: 5234,
      conversions: 847,
      revenue: '€24,580',
      roi: '6.2x',
      status: 'completed'
    },
    {
      name: 'Product Launch Announcement',
      channels: ['Email', 'WhatsApp'],
      sent: 3890,
      conversions: 421,
      revenue: '€15,240',
      roi: '4.8x',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Comunicación Omnicanal</CardTitle>
              <CardDescription className="text-base">
                Gestión unificada de WhatsApp, Email y SMS desde una sola plataforma
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Canal</CardTitle>
          <CardDescription>Métricas comparativas de todos los canales activos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.name} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{channel.name}</h3>
                        <Badge variant="default" className="text-xs mt-1">
                          {channel.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mensajes enviados</span>
                      <span className="font-semibold">{channel.sent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tasa de apertura</span>
                      <span className="font-semibold text-green-600">{channel.openRate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tasa de clicks</span>
                      <span className="font-semibold text-blue-600">{channel.clickRate}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex gap-2 text-xs">
                      <div className="flex-1 text-center">
                        <p className="text-muted-foreground mb-1">Abiertos</p>
                        <p className="font-semibold">{channel.opened}</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-muted-foreground mb-1">Clicks</p>
                        <p className="font-semibold">{channel.clicked}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Channel Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Campañas Multicanal</CardTitle>
          <CardDescription>Campañas coordinadas a través de múltiples canales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns.map((campaign, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{campaign.name}</h3>
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status === 'active' ? 'Activa' : 'Completada'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {campaign.channels.map((ch) => (
                      <Badge key={ch} variant="outline" className="text-xs">
                        {ch}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Enviados</p>
                  <div className="flex items-center gap-1">
                    <Send className="w-3 h-3 text-muted-foreground" />
                    <p className="font-semibold">{campaign.sent.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conversiones</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <p className="font-semibold text-green-600">{campaign.conversions}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ingresos</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="font-semibold text-green-600">{campaign.revenue}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ROI</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="font-semibold text-green-600">{campaign.roi}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Unified Inbox */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Bandeja de Entrada Unificada
          </CardTitle>
          <CardDescription>Gestiona todas las conversaciones desde un solo lugar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">12 conversaciones sin leer</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Ver</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">34 respuestas pendientes</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Ver</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">SMS</p>
                  <p className="text-xs text-muted-foreground">5 respuestas recibidas</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Ver</Button>
            </div>
          </div>

          <Button className="w-full mt-4 gap-2">
            <Users className="w-4 h-4" />
            Abrir Inbox Unificado
          </Button>
        </CardContent>
      </Card>

      {/* Channel Comparison Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Canal Más Efectivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">SMS</p>
                <p className="text-xs text-green-600">95% tasa de apertura</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mayor Volumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">Email</p>
                <p className="text-xs text-muted-foreground">3.4K mensajes/mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mejor Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">WhatsApp</p>
                <p className="text-xs text-green-600">39% click rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiChannelCommunication;
