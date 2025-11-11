import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Smartphone, Send, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <Card className="border-purple-accent/20 bg-card/30 backdrop-blur-sm hover:border-purple-accent/40 transition-all duration-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-accent/10 backdrop-blur-sm">
              <Send className="w-7 h-7 text-purple-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
                Comunicación Omnicanal
              </CardTitle>
              <p className="text-base text-muted-foreground font-light">
                Gestión unificada de WhatsApp, Email y SMS desde una sola plataforma
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Channel Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-tight">Rendimiento por Canal</CardTitle>
            <p className="text-sm text-muted-foreground font-light">Métricas comparativas de todos los canales activos</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channels.map((channel, idx) => {
                const Icon = channel.icon;
                return (
                  <motion.div
                    key={channel.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="border border-border/50 rounded-lg p-4 space-y-4 bg-card/20 backdrop-blur-sm hover:shadow-lg hover:border-electric-cyan/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-electric-cyan/10">
                          <Icon className="w-5 h-5 text-electric-cyan" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{channel.name}</h3>
                          <Badge className="text-xs mt-1 bg-green-500 text-background">
                            {channel.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Mensajes enviados</span>
                        <span className="font-bold text-foreground">{channel.sent.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tasa de apertura</span>
                        <span className="font-bold text-green-500">{channel.openRate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tasa de clicks</span>
                        <span className="font-bold text-electric-cyan">{channel.clickRate}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <div className="flex gap-2 text-xs">
                        <div className="flex-1 text-center">
                          <p className="text-muted-foreground mb-1">Abiertos</p>
                          <p className="font-bold text-foreground">{channel.opened}</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-muted-foreground mb-1">Clicks</p>
                          <p className="font-bold text-foreground">{channel.clicked}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Multi-Channel Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-tight">Campañas Multicanal</CardTitle>
            <p className="text-sm text-muted-foreground font-light">Campañas coordinadas a través de múltiples canales</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.map((campaign, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="border border-border/50 rounded-lg p-4 bg-card/20 backdrop-blur-sm hover:shadow-lg hover:border-electric-cyan/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-foreground">{campaign.name}</h3>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className={campaign.status === 'active' ? 'bg-green-500 text-background' : ''}>
                        {campaign.status === 'active' ? 'Activa' : 'Completada'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.channels.map((ch) => (
                        <Badge key={ch} variant="outline" className="text-xs border-electric-cyan/30">
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
                      <p className="font-bold text-foreground">{campaign.sent.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Conversiones</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <p className="font-bold text-green-500">{campaign.conversions}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ingresos</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <p className="font-bold text-green-500">{campaign.revenue}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ROI</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-electric-cyan" />
                      <p className="font-bold text-electric-cyan">{campaign.roi}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MultiChannelCommunication;