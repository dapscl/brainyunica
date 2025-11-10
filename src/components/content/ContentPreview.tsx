import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ContentPreviewProps {
  platform: string;
  text: string;
  mediaUrls: string[];
}

const PLATFORM_CONFIG = {
  facebook: { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  instagram: { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  twitter: { name: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
};

export const ContentPreview = ({ platform, text, mediaUrls }: ContentPreviewProps) => {
  const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon size={20} style={{ color: config.color }} />
          <CardTitle className="text-base">{config.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* User info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>BR</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">Tu Marca</p>
            <p className="text-xs text-muted-foreground">Ahora</p>
          </div>
        </div>

        {/* Post text */}
        {text && (
          <p className="text-sm whitespace-pre-wrap">{text}</p>
        )}

        {/* Media preview */}
        {mediaUrls.length > 0 && (
          <div className={`grid gap-1 ${mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {mediaUrls.slice(0, 4).map((url, idx) => (
              <div key={idx} className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Platform-specific actions */}
        <div className="flex items-center gap-4 pt-2 text-muted-foreground text-sm border-t">
          <button className="hover:text-foreground">👍 Me gusta</button>
          <button className="hover:text-foreground">💬 Comentar</button>
          <button className="hover:text-foreground">↗️ Compartir</button>
        </div>
      </CardContent>
    </Card>
  );
};
