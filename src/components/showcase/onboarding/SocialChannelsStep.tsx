import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';

interface SocialChannelsStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const SocialChannelsStep = ({ data, onUpdate }: SocialChannelsStepProps) => {
  const channels = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      description: 'Alcanza audiencias masivas con anuncios segmentados'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-500/10',
      description: 'Contenido visual y stories para engagement alto'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-700/10',
      description: 'B2B marketing y networking profesional'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: FaXTwitter,
      color: 'text-foreground',
      bgColor: 'bg-muted',
      description: 'Conversaciones en tiempo real y trending topics'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: FaTiktok,
      color: 'text-foreground',
      bgColor: 'bg-muted',
      description: 'Videos virales para audiencias jóvenes'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
      description: 'Video marketing de formato largo'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      description: 'Comunicación directa con clientes'
    }
  ];

  const toggleChannel = (channelId: string) => {
    const current = data.channels || [];
    const updated = current.includes(channelId)
      ? current.filter((id: string) => id !== channelId)
      : [...current, channelId];
    onUpdate({ ...data, channels: updated });
  };

  const isConnected = (channelId: string) => {
    return (data.channels || []).includes(channelId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Canales Sociales</h2>
        <p className="text-muted-foreground">
          Conecta las plataformas donde quieres publicar y gestionar contenido
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="default">Demo Mode</Badge>
            <p className="text-sm font-medium">En el demo, simularemos la conexión de canales</p>
          </div>
          <p className="text-sm text-muted-foreground">
            En la versión real, te redirigiremos a cada plataforma para autorizar el acceso mediante OAuth 2.0
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const connected = isConnected(channel.id);
          
          return (
            <Card 
              key={channel.id}
              className={`
                transition-all hover:shadow-lg cursor-pointer
                ${connected ? 'border-primary shadow-md' : 'border-border'}
              `}
              onClick={() => toggleChannel(channel.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${channel.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${channel.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <Badge 
                        variant={connected ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {connected ? 'Conectado' : 'Conectar'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{channel.description}</CardDescription>
                
                {connected && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estado</span>
                      <span className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Activo
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Canales Seleccionados</CardTitle>
          <CardDescription>
            Has conectado {(data.channels || []).length} de {channels.length} canales disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(data.channels || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Selecciona al menos un canal para continuar
              </p>
            ) : (
              (data.channels || []).map((channelId: string) => {
                const channel = channels.find(c => c.id === channelId);
                if (!channel) return null;
                const Icon = channel.icon;
                
                return (
                  <Badge key={channelId} variant="default" className="flex items-center gap-2 py-2 px-3">
                    <Icon className="w-4 h-4" />
                    {channel.name}
                  </Badge>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialChannelsStep;
