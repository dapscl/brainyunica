import { useState } from 'react';
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
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Image, Loader2, Share2, Eye, Square, RectangleVertical, Copy as CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ContentExporterProps {
  content: string;
  title?: string;
  brandName?: string;
  hashtags?: string[];
  className?: string;
}

type ImageFormat = 'story' | 'square';

const ContentExporter = ({ content, title, brandName, hashtags, className }: ContentExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<ImageFormat>('story');
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');

  const generateCanvas = (format: ImageFormat): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    // Set canvas dimensions based on format
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
    ctx.fillText((brandName || 'B').charAt(0).toUpperCase(), 80 + logoSize / 2, logoY + logoSize * 0.65);

    // Brand name
    ctx.textAlign = 'left';
    ctx.font = `bold ${format === 'story' ? 36 : 28}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(brandName || 'Brainy', 80 + logoSize + 20, logoY + logoSize * 0.45);

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
    if (title) {
      ctx.font = `bold ${format === 'story' ? 28 : 22}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = '#00f5ff';
      ctx.fillText(title.substring(0, 40), contentPadding + 40, textY);
      textY += format === 'story' ? 50 : 40;
    }

    // Content text (word wrap)
    ctx.font = `${format === 'story' ? 24 : 18}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#e5e7eb';
    
    const words = content.split(' ');
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
    if (hashtags?.length) {
      const hashtagY = canvas.height - (format === 'story' ? 180 : 120);
      ctx.font = `${format === 'story' ? 20 : 16}px Inter, system-ui, sans-serif`;
      let hashtagX = contentPadding + 40;
      
      for (const tag of hashtags.slice(0, format === 'story' ? 5 : 4)) {
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
    </>
  );
};

export default ContentExporter;