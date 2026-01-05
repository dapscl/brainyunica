import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Image,
  Video,
  Layers,
  FileText,
  GripVertical,
  Edit2,
  Trash2,
  Send,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { CalendarContent } from './CalendarBrainy';

interface ContentQueueProps {
  content: CalendarContent[];
  onContentClick?: (content: CalendarContent) => void;
  onEdit?: (content: CalendarContent) => void;
  onDelete?: (content: CalendarContent) => void;
  onPublish?: (content: CalendarContent) => void;
}

export const ContentQueue = ({
  content,
  onContentClick,
  onEdit,
  onDelete,
  onPublish
}: ContentQueueProps) => {
  const pendingContent = content
    .filter(c => c.status === 'draft' || c.status === 'scheduled')
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  const getFormatIcon = (contentFormat: string) => {
    switch (contentFormat) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'carousel': return <Layers className="w-4 h-4" />;
      case 'story': return <Clock className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30">
            <Clock className="w-3 h-3 mr-1" />
            Programado
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary">
            <Edit2 className="w-3 h-3 mr-1" />
            Borrador
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPlatformColors: Record<string, string> = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    facebook: 'bg-blue-600',
    linkedin: 'bg-blue-700',
    twitter: 'bg-sky-500',
    tiktok: 'bg-black',
    youtube: 'bg-red-600'
  };

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-electric-cyan" />
            <span>Cola de Publicación</span>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            {pendingContent.length} pendientes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {pendingContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No hay contenido pendiente</p>
              <p className="text-xs mt-1">¡Todo está publicado!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-4 rounded-lg border bg-card/50 cursor-pointer",
                    "hover:border-electric-cyan/50 transition-all group"
                  )}
                  onClick={() => onContentClick?.(item)}
                  draggable
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    
                    <div className={cn(
                      "p-2 rounded-lg",
                      item.format === 'video' ? 'bg-red-500/20 text-red-400' :
                      item.format === 'carousel' ? 'bg-purple-500/20 text-purple-400' :
                      item.format === 'story' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-blue-500/20 text-blue-400'
                    )}>
                      {getFormatIcon(item.format)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        {item.promoted && (
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{format(item.scheduledDate, "d MMM 'a las' HH:mm", { locale: es })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <div className="flex items-center gap-1">
                          {item.platforms.map((platform) => (
                            <div
                              key={platform}
                              className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                                getPlatformColors[platform] || 'bg-gray-500'
                              )}
                              title={platform}
                            >
                              {platform[0].toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        {item.status === 'draft' && (
                          <DropdownMenuItem onClick={() => onPublish?.(item)}>
                            <Send className="w-4 h-4 mr-2" />
                            Publicar ahora
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => onDelete?.(item)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
