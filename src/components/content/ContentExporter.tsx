import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, Image, Loader2, Share2, Eye, Square, RectangleVertical, Copy as CopyIcon, History, Trash2, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { toast } from 'sonner';

interface ContentExporterProps {
  content: string;
  title?: string;
  brandName?: string;
  hashtags?: string[];
  className?: string;
}

type ImageFormat = 'story' | 'square';

interface ExportHistoryItem {
  id: string;
  content: string;
  title?: string;
  brandName?: string;
  hashtags?: string[];
  exportedAt: string;
  format: string;
}

const HISTORY_KEY = 'brainy-export-history';
const MAX_HISTORY_ITEMS = 20;

const getExportHistory = (): ExportHistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToHistory = (item: Omit<ExportHistoryItem, 'id' | 'exportedAt'>) => {
  const history = getExportHistory();
  const newItem: ExportHistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    exportedAt: new Date().toISOString(),
  };
  const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return newItem;
};

const removeFromHistory = (id: string) => {
  const history = getExportHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

const ContentExporter = ({ content, title, brandName, hashtags, className }: ContentExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<ImageFormat>('story');
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([]);
  const [historyPreviewItem, setHistoryPreviewItem] = useState<ExportHistoryItem | null>(null);

  useEffect(() => {
    setExportHistory(getExportHistory());
  }, [showHistory]);

  const generateCanvas = (format: ImageFormat, itemContent?: string, itemTitle?: string, itemBrandName?: string, itemHashtags?: string[]): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    const finalContent = itemContent || content;
    const finalTitle = itemTitle || title;
    const finalBrandName = itemBrandName || brandName;
    const finalHashtags = itemHashtags || hashtags;

    if (format === 'story') {
      canvas.width = 1080;
      canvas.height = 1920;
    } else {
      canvas.width = 1080;
      canvas.height = 1080;
    }

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, format === 'story' ? 200 : 100, format === 'story' ? 150 : 80, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - (format === 'story' ? 300 : 150), format === 'story' ? 200 : 100, 0, Math.PI * 2);
    ctx.stroke();

    // Brand logo circle
    const logoSize = format === 'story' ? 100 : 70;
    const logoY = format === 'story' ? 120 : 60;
    const logoGradient = ctx.createLinearGradient(80, logoY, 80 + logoSize, logoY + logoSize);
    logoGradient.addColorStop(0, '#00f5ff');
    logoGradient.addColorStop(1, '#a855f7');
    ctx.fillStyle = logoGradient;
    ctx.beginPath();
    ctx.roundRect(80, logoY, logoSize, logoSize, 20);
    ctx.fill();

    // Brand initial
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${format === 'story' ? 48 : 36}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText((finalBrandName || 'B').charAt(0).toUpperCase(), 80 + logoSize / 2, logoY + logoSize * 0.65);

    // Brand name
    ctx.textAlign = 'left';
    ctx.font = `bold ${format === 'story' ? 36 : 28}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(finalBrandName || 'Brainy', 80 + logoSize + 20, logoY + logoSize * 0.45);

    // Subtitle
    ctx.font = `${format === 'story' ? 20 : 16}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Generado con Brainy AI', 80 + logoSize + 20, logoY + logoSize * 0.75);

    // Content area
    const contentPadding = format === 'story' ? 80 : 60;
    const contentTop = format === 'story' ? 300 : 180;
    const contentWidth = canvas.width - contentPadding * 2;
    const contentHeight = format === 'story' ? canvas.height - contentTop - 200 : canvas.height - contentTop - 150;

    // Content background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(contentPadding, contentTop, contentWidth, contentHeight, 24);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Title if present
    let textY = contentTop + (format === 'story' ? 60 : 50);
    if (finalTitle) {
      ctx.font = `bold ${format === 'story' ? 28 : 22}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = '#00f5ff';
      ctx.fillText(finalTitle.substring(0, 40), contentPadding + 40, textY);
      textY += format === 'story' ? 50 : 40;
    }

    // Content text (word wrap)
    ctx.font = `${format === 'story' ? 24 : 18}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#e5e7eb';
    
    const words = finalContent.split(' ');
    let line = '';
    const lineHeight = format === 'story' ? 38 : 28;
    const maxWidth = contentWidth - 80;
    const maxY = contentTop + contentHeight - (format === 'story' ? 100 : 80);

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), contentPadding + 40, textY);
        line = word + ' ';
        textY += lineHeight;
        
        if (textY > maxY) {
          ctx.fillText('...', contentPadding + 40, textY);
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (line.trim() && textY <= maxY) {
      ctx.fillText(line.trim(), contentPadding + 40, textY);
    }

    // Hashtags at bottom
    if (finalHashtags?.length) {
      const hashtagY = canvas.height - (format === 'story' ? 180 : 120);
      ctx.font = `${format === 'story' ? 20 : 16}px Inter, system-ui, sans-serif`;
      let hashtagX = contentPadding + 40;
      
      for (const tag of finalHashtags.slice(0, format === 'story' ? 5 : 4)) {
        const tagWidth = ctx.measureText(tag).width + 30;
        
        if (hashtagX + tagWidth > canvas.width - contentPadding) break;
        
        ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.beginPath();
        ctx.roundRect(hashtagX, hashtagY - 25, tagWidth, format === 'story' ? 40 : 32, 20);
        ctx.fill();
        
        ctx.fillStyle = '#a855f7';
        ctx.fillText(tag, hashtagX + 15, hashtagY + (format === 'story' ? 5 : 0));
        
        hashtagX += tagWidth + 12;
      }
    }

    // Footer
    ctx.font = `${format === 'story' ? 18 : 14}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    const footerText = `Creado con Brainy • ${new Date().toLocaleDateString('es-ES')}`;
    ctx.fillText(footerText, canvas.width / 2, canvas.height - (format === 'story' ? 60 : 40));

    return canvas;
  };

  const handleShowPreview = (format: ImageFormat) => {
    try {
      const canvas = generateCanvas(format);
      setPreviewDataUrl(canvas.toDataURL('image/png'));
      setPreviewFormat(format);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Error al generar vista previa');
    }
  };

  const handleDownloadFromPreview = () => {
    if (!previewDataUrl) return;
    
    const link = document.createElement('a');
    const formatLabel = previewFormat === 'story' ? 'story' : 'cuadrado';
    link.download = `${title || 'contenido-brainy'}-${formatLabel}-${Date.now()}.png`;
    link.href = previewDataUrl;
    link.click();
    
    saveToHistory({ content, title, brandName, hashtags, format: previewFormat });
    toast.success('Imagen descargada');
    setShowPreview(false);
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Por favor habilita las ventanas emergentes');
        return;
      }

      const hashtagsText = hashtags?.length ? hashtags.join(' ') : '';
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title || 'Contenido Generado'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
              font-family: 'Inter', system-ui, sans-serif;
              padding: 60px;
              max-width: 800px;
              margin: 0 auto;
              background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
              color: #ffffff;
              min-height: 100vh;
            }
            
            .header {
              display: flex;
              align-items: center;
              gap: 16px;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid rgba(0, 245, 255, 0.3);
            }
            
            .logo {
              width: 50px;
              height: 50px;
              background: linear-gradient(135deg, #00f5ff, #a855f7);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 24px;
              color: white;
            }
            
            .brand-info h1 {
              font-size: 28px;
              font-weight: 700;
              background: linear-gradient(90deg, #00f5ff, #a855f7);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .brand-info p { font-size: 14px; color: #9ca3af; margin-top: 4px; }
            
            .content-card {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(0, 245, 255, 0.2);
              border-radius: 16px;
              padding: 32px;
              margin-bottom: 24px;
            }
            
            .content-title { font-size: 18px; font-weight: 600; color: #00f5ff; margin-bottom: 16px; }
            .content-text { font-size: 16px; line-height: 1.8; color: #e5e7eb; white-space: pre-wrap; }
            
            .hashtags { margin-top: 24px; display: flex; flex-wrap: wrap; gap: 8px; }
            .hashtag { background: rgba(168, 85, 247, 0.2); color: #a855f7; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
            
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: #6b7280; }
            .footer span { color: #00f5ff; }
            
            @media print {
              body { background: white; color: #1f2937; padding: 40px; }
              .content-card { background: #f9fafb; border: 1px solid #e5e7eb; }
              .content-text { color: #374151; }
              .brand-info h1 { background: none; -webkit-text-fill-color: #1f2937; color: #1f2937; }
              .logo { background: #6366f1; }
              .hashtag { background: #ede9fe; color: #7c3aed; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${(brandName || 'B').charAt(0).toUpperCase()}</div>
            <div class="brand-info">
              <h1>${brandName || 'Contenido Brainy'}</h1>
              <p>Generado con Brainy AI</p>
            </div>
          </div>
          
          <div class="content-card">
            ${title ? `<div class="content-title">${title}</div>` : ''}
            <div class="content-text">${content}</div>
            ${hashtagsText ? `<div class="hashtags">${hashtags?.map(tag => `<span class="hashtag">${tag}</span>`).join('')}</div>` : ''}
          </div>
          
          <div class="footer">
            Creado con <span>Brainy</span> • ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
      
      saveToHistory({ content, title, brandName, hashtags, format: 'pdf' });
      toast.success('PDF listo para descargar');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Error al exportar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToImage = async (format: ImageFormat) => {
    setIsExporting(true);
    try {
      const canvas = generateCanvas(format);
      const link = document.createElement('a');
      const formatLabel = format === 'story' ? 'story' : 'cuadrado';
      link.download = `${title || 'contenido-brainy'}-${formatLabel}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      saveToHistory({ content, title, brandName, hashtags, format });
      toast.success('Imagen descargada');
    } catch (error) {
      console.error('Error exporting to image:', error);
      toast.error('Error al exportar imagen');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const fullText = hashtags?.length 
        ? `${content}\n\n${hashtags.join(' ')}`
        : content;
      
      await navigator.clipboard.writeText(fullText);
      toast.success('Contenido copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  // Social sharing functions
  const shareToWhatsApp = () => {
    const text = hashtags?.length 
      ? `${content}\n\n${hashtags.join(' ')}`
      : content;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success('Abriendo WhatsApp...');
  };

  const shareToTwitter = () => {
    const text = content.substring(0, 280);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success('Abriendo Twitter/X...');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(content)}`;
    window.open(url, '_blank');
    toast.success('Abriendo Facebook...');
  };

  // History functions
  const handleRedownload = (item: ExportHistoryItem) => {
    try {
      if (item.format === 'pdf') {
        toast.info('Los PDFs deben exportarse de nuevo');
        return;
      }
      const format = item.format as ImageFormat;
      const canvas = generateCanvas(format, item.content, item.title, item.brandName, item.hashtags);
      const link = document.createElement('a');
      link.download = `${item.title || 'contenido-brainy'}-${item.format}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Imagen descargada');
    } catch (error) {
      toast.error('Error al descargar');
    }
  };

  const handlePreviewHistoryItem = (item: ExportHistoryItem) => {
    try {
      const format = (item.format === 'story' || item.format === 'square') ? item.format : 'story';
      const canvas = generateCanvas(format as ImageFormat, item.content, item.title, item.brandName, item.hashtags);
      setPreviewDataUrl(canvas.toDataURL('image/png'));
      setPreviewFormat(format as ImageFormat);
      setHistoryPreviewItem(item);
      setShowHistory(false);
      setShowPreview(true);
    } catch (error) {
      toast.error('Error al generar vista previa');
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    removeFromHistory(id);
    setExportHistory(getExportHistory());
    toast.success('Elemento eliminado del historial');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={className}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleShowPreview('story')}>
            <Eye className="w-4 h-4 mr-2" />
            Vista previa Story (9:16)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShowPreview('square')}>
            <Eye className="w-4 h-4 mr-2" />
            Vista previa Cuadrado (1:1)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => exportToImage('story')}>
            <RectangleVertical className="w-4 h-4 mr-2" />
            Descargar Story (1080x1920)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToImage('square')}>
            <Square className="w-4 h-4 mr-2" />
            Descargar Cuadrado (1080x1080)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Descargar PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyToClipboard}>
            <CopyIcon className="w-4 h-4 mr-2" />
            Copiar texto
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir en redes
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={shareToWhatsApp}>
                <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareToTwitter}>
                <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                Twitter / X
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareToFacebook}>
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowHistory(true)}>
            <History className="w-4 h-4 mr-2" />
            Historial de exportaciones
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-electric-cyan" />
              Vista Previa - {previewFormat === 'story' ? 'Story (9:16)' : 'Cuadrado (1:1)'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className={`overflow-hidden rounded-lg border border-border/50 ${previewFormat === 'story' ? 'max-h-[500px]' : 'max-h-[400px]'}`}>
              {previewDataUrl && (
                <img 
                  src={previewDataUrl} 
                  alt="Vista previa del contenido"
                  className={`w-full h-auto object-contain ${previewFormat === 'story' ? 'max-w-[280px]' : 'max-w-[400px]'}`}
                />
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadFromPreview}
                className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-electric-cyan" />
              Historial de Exportaciones
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            {exportHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay exportaciones anteriores</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exportHistory.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-accent/20 text-purple-accent font-medium">
                            {item.format === 'story' ? 'Story' : item.format === 'square' ? 'Cuadrado' : 'PDF'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.exportedAt).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {item.title && (
                          <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.format !== 'pdf' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handlePreviewHistoryItem(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRedownload(item)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteHistoryItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentExporter;