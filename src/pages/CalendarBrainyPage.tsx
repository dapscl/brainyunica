import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { CalendarBrainy, type CalendarContent } from '@/components/calendar/CalendarBrainy';
import { ContentQueue } from '@/components/calendar/ContentQueue';
import { ContentStats } from '@/components/calendar/ContentStats';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Sparkles, Calendar, Brain } from 'lucide-react';
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns';

// Generate mock content for demo
const generateMockContent = (): CalendarContent[] => {
  const today = new Date();
  const formats: CalendarContent['format'][] = ['image', 'video', 'carousel', 'story', 'text'];
  const statuses: CalendarContent['status'][] = ['draft', 'scheduled', 'published'];
  const platforms = ['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok'];
  
  const titles = [
    'Nuevo producto: Lanzamiento Q1',
    'Tips de productividad',
    'Behind the scenes',
    'Testimonial cliente',
    'Oferta especial 20% OFF',
    'Tutorial paso a paso',
    'Reels trending',
    'Infografía estadísticas',
    'Colaboración influencer',
    'Anuncio importante',
    'Story interactiva',
    'Carrusel educativo',
    'Video explicativo',
    'Post motivacional',
    'Promoción flash'
  ];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `content-${i}`,
    title: titles[i % titles.length],
    scheduledDate: setMinutes(setHours(addDays(today, Math.floor(Math.random() * 30) - 10), 9 + Math.floor(Math.random() * 10)), Math.floor(Math.random() * 4) * 15),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    format: formats[Math.floor(Math.random() * formats.length)],
    platforms: platforms.slice(0, Math.floor(Math.random() * 3) + 1),
    promoted: Math.random() > 0.7,
    time: `${9 + Math.floor(Math.random() * 10)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`
  }));
};

export default function CalendarBrainyPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState<CalendarContent[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    format: 'image' as CalendarContent['format'],
    platforms: [] as string[],
    promoted: false
  });

  useEffect(() => {
    checkAuth();
    // Load mock content for demo
    setContent(generateMockContent());
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/trial');
      return;
    }
    setIsAuthenticated(true);
  };

  const handleContentClick = (item: CalendarContent) => {
    toast.info(`Editando: ${item.title}`);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowCreateModal(true);
  };

  const handleContentDrop = (contentId: string, newDate: Date) => {
    setContent(prev => prev.map(item => 
      item.id === contentId 
        ? { ...item, scheduledDate: newDate }
        : item
    ));
    toast.success('Contenido reprogramado');
  };

  const handleCreateContent = (date: Date) => {
    setSelectedDate(date);
    setShowCreateModal(true);
  };

  const handleSaveContent = () => {
    if (!newContent.title || !selectedDate) {
      toast.error('Completa los campos requeridos');
      return;
    }

    const newItem: CalendarContent = {
      id: `content-${Date.now()}`,
      title: newContent.title,
      scheduledDate: selectedDate,
      status: 'draft',
      format: newContent.format,
      platforms: newContent.platforms,
      promoted: newContent.promoted
    };

    setContent(prev => [...prev, newItem]);
    setShowCreateModal(false);
    setNewContent({
      title: '',
      description: '',
      format: 'image',
      platforms: [],
      promoted: false
    });
    toast.success('Contenido creado');
  };

  const togglePlatform = (platform: string) => {
    setNewContent(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-surface flex items-center justify-center">
        <div className="animate-pulse text-electric-cyan">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-surface">
      <ShowcaseHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/trial/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-electric-cyan/20 to-purple-accent/20">
                <Calendar className="w-6 h-6 text-electric-cyan" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                  CalendarBrainy™
                </h1>
                <p className="text-sm text-muted-foreground">
                  Planifica, programa y publica automáticamente
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setSelectedDate(new Date());
                setShowCreateModal(true);
              }}
              className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Contenido
            </Button>
            
            <Button variant="outline" className="border-electric-cyan/30">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              Sugerir Ideas
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ContentStats content={content} />
        </motion.div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <CalendarBrainy
              content={content}
              onContentClick={handleContentClick}
              onDateClick={handleDateClick}
              onContentDrop={handleContentDrop}
              onCreateContent={handleCreateContent}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ContentQueue
              content={content}
              onContentClick={handleContentClick}
              onEdit={(item) => toast.info(`Editando: ${item.title}`)}
              onDelete={(item) => {
                setContent(prev => prev.filter(c => c.id !== item.id));
                toast.success('Contenido eliminado');
              }}
              onPublish={(item) => {
                setContent(prev => prev.map(c => 
                  c.id === item.id ? { ...c, status: 'published' as const } : c
                ));
                toast.success('¡Publicado!');
              }}
            />
          </motion.div>
        </div>
        
        {/* AI Suggestions Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-6 rounded-xl bg-gradient-to-r from-purple-accent/20 to-electric-cyan/20 border border-purple-accent/30"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-accent/30">
              <Brain className="w-6 h-6 text-purple-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">CalendarBrainy™ sugiere:</h3>
              <p className="text-sm text-muted-foreground">
                Basándome en tu historial, te recomiendo publicar los <strong>martes y jueves a las 10:00 AM</strong> para mayor engagement. 
                También detecto un gap de contenido el próximo fin de semana.
              </p>
            </div>
            <Button variant="outline" className="border-purple-accent/30 hover:bg-purple-accent/10">
              Ver Recomendaciones
            </Button>
          </div>
        </motion.div>
      </main>
      
      {/* Create Content Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-card border-electric-cyan/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-electric-cyan" />
              Nuevo Contenido
              {selectedDate && (
                <span className="text-sm font-normal text-muted-foreground">
                  - {format(selectedDate, 'dd/MM/yyyy')}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                placeholder="Ej: Post sobre nuevo producto"
                value={newContent.title}
                onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Describe el contenido..."
                value={newContent.description}
                onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                className="bg-background/50"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Formato</Label>
              <Select
                value={newContent.format}
                onValueChange={(value: CalendarContent['format']) => 
                  setNewContent(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Imagen</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="carousel">Carrusel</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Plataformas</Label>
              <div className="flex flex-wrap gap-2">
                {['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok'].map((platform) => (
                  <Button
                    key={platform}
                    type="button"
                    variant={newContent.platforms.includes(platform) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePlatform(platform)}
                    className={newContent.platforms.includes(platform) 
                      ? 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30' 
                      : ''}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="promoted"
                checked={newContent.promoted}
                onCheckedChange={(checked) => 
                  setNewContent(prev => ({ ...prev, promoted: !!checked }))
                }
              />
              <Label htmlFor="promoted" className="flex items-center gap-2 cursor-pointer">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Promocionar este contenido
              </Label>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveContent}
                className="bg-gradient-to-r from-electric-cyan to-purple-accent"
              >
                Crear Contenido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
