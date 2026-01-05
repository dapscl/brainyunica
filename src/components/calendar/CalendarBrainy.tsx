import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Image,
  Video,
  FileText,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  GripVertical
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface CalendarContent {
  id: string;
  title: string;
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  format: 'image' | 'video' | 'carousel' | 'story' | 'text';
  platforms: string[];
  promoted?: boolean;
  time?: string;
}

interface CalendarBrainyProps {
  content: CalendarContent[];
  onContentClick?: (content: CalendarContent) => void;
  onDateClick?: (date: Date) => void;
  onContentDrop?: (contentId: string, newDate: Date) => void;
  onCreateContent?: (date: Date) => void;
}

export const CalendarBrainy = ({
  content,
  onContentClick,
  onDateClick,
  onContentDrop,
  onCreateContent
}: CalendarBrainyProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [draggedContent, setDraggedContent] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { locale: es });
      const end = endOfWeek(endOfMonth(currentDate), { locale: es });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(currentDate, { locale: es });
      const end = endOfWeek(currentDate, { locale: es });
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, view]);

  const getContentForDate = (date: Date) => {
    return content.filter(item => isSameDay(item.scheduledDate, date));
  };

  const getFormatIcon = (contentFormat: string) => {
    switch (contentFormat) {
      case 'video': return <Video className="w-3 h-3" />;
      case 'carousel': return <Layers className="w-3 h-3" />;
      case 'story': return <Clock className="w-3 h-3" />;
      case 'text': return <FileText className="w-3 h-3" />;
      default: return <Image className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled': return 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleDragStart = (contentId: string) => {
    setDraggedContent(contentId);
  };

  const handleDragEnd = () => {
    if (draggedContent && dragOverDate && onContentDrop) {
      onContentDrop(draggedContent, dragOverDate);
    }
    setDraggedContent(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setDragOverDate(date);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-electric-cyan/20">
              <CalendarIcon className="w-5 h-5 text-electric-cyan" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                CalendarBrainy™
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Semana del' d MMMM", { locale: es })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'week')}>
              <TabsList className="bg-card/50">
                <TabsTrigger value="month" className="text-xs">Mes</TabsTrigger>
                <TabsTrigger value="week" className="text-xs">Semana</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-1 ml-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs">
                Hoy
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className={cn(
          "grid grid-cols-7 gap-1",
          view === 'week' ? 'min-h-[300px]' : ''
        )}>
          {days.map((day, index) => {
            const dayContent = getContentForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isDragOver = dragOverDate && isSameDay(day, dragOverDate);
            
            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={cn(
                  "min-h-[100px] rounded-lg border p-1 transition-all cursor-pointer group",
                  isCurrentMonth ? 'bg-card/50' : 'bg-card/20 opacity-50',
                  isToday && 'border-electric-cyan ring-1 ring-electric-cyan/30',
                  isDragOver && 'border-purple-accent bg-purple-accent/10 ring-2 ring-purple-accent/50',
                  !isToday && !isDragOver && 'border-border/30 hover:border-electric-cyan/50'
                )}
                onClick={() => onDateClick?.(day)}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={handleDragEnd}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    isToday && 'bg-electric-cyan text-white'
                  )}>
                    {format(day, 'd')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateContent?.(day);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="space-y-1 max-h-[70px] overflow-y-auto scrollbar-thin">
                  <AnimatePresence>
                    {dayContent.slice(0, view === 'week' ? 5 : 3).map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        draggable
                        onDragStart={() => handleDragStart(item.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onContentClick?.(item);
                        }}
                        className={cn(
                          "flex items-center gap-1 p-1 rounded text-xs cursor-grab active:cursor-grabbing",
                          "border transition-all hover:scale-[1.02]",
                          getStatusColor(item.status),
                          draggedContent === item.id && 'opacity-50'
                        )}
                      >
                        <GripVertical className="w-2 h-2 opacity-50" />
                        {getFormatIcon(item.format)}
                        <span className="truncate flex-1">{item.title}</span>
                        {item.promoted && (
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {dayContent.length > (view === 'week' ? 5 : 3) && (
                    <div className="text-xs text-muted-foreground text-center py-0.5">
                      +{dayContent.length - (view === 'week' ? 5 : 3)} más
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
            <span>Publicado</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-electric-cyan/20 border border-electric-cyan/30" />
            <span>Programado</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-muted border border-border" />
            <span>Borrador</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>Promocionado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
