import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Image, Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContentExporterProps {
  content: string;
  title?: string;
  brandName?: string;
  hashtags?: string[];
  className?: string;
}

const ContentExporter = ({ content, title, brandName, hashtags, className }: ContentExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Create a simple PDF using the browser's print functionality
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
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
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
            
            .brand-info p {
              font-size: 14px;
              color: #9ca3af;
              margin-top: 4px;
            }
            
            .content-card {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(0, 245, 255, 0.2);
              border-radius: 16px;
              padding: 32px;
              margin-bottom: 24px;
            }
            
            .content-title {
              font-size: 18px;
              font-weight: 600;
              color: #00f5ff;
              margin-bottom: 16px;
            }
            
            .content-text {
              font-size: 16px;
              line-height: 1.8;
              color: #e5e7eb;
              white-space: pre-wrap;
            }
            
            .hashtags {
              margin-top: 24px;
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            
            .hashtag {
              background: rgba(168, 85, 247, 0.2);
              color: #a855f7;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 500;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              font-size: 12px;
              color: #6b7280;
            }
            
            .footer span {
              color: #00f5ff;
            }
            
            @media print {
              body {
                background: white;
                color: #1f2937;
                padding: 40px;
              }
              
              .content-card {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
              }
              
              .content-text {
                color: #374151;
              }
              
              .brand-info h1 {
                background: none;
                -webkit-text-fill-color: #1f2937;
                color: #1f2937;
              }
              
              .logo {
                background: #6366f1;
              }
              
              .hashtag {
                background: #ede9fe;
                color: #7c3aed;
              }
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
            ${hashtagsText ? `
              <div class="hashtags">
                ${hashtags?.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            Creado con <span>Brainy</span> • ${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for styles to load
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      toast.success('PDF listo para descargar');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Error al exportar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToImage = async () => {
    setIsExporting(true);
    try {
      // Create a canvas element to render the content as an image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Set canvas dimensions (Instagram story size)
      canvas.width = 1080;
      canvas.height = 1920;

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
      ctx.arc(100, 200, 150, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.beginPath();
      ctx.arc(canvas.width - 100, canvas.height - 300, 200, 0, Math.PI * 2);
      ctx.stroke();

      // Brand logo circle
      const logoGradient = ctx.createLinearGradient(80, 120, 180, 220);
      logoGradient.addColorStop(0, '#00f5ff');
      logoGradient.addColorStop(1, '#a855f7');
      ctx.fillStyle = logoGradient;
      ctx.beginPath();
      ctx.roundRect(80, 120, 100, 100, 20);
      ctx.fill();

      // Brand initial
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((brandName || 'B').charAt(0).toUpperCase(), 130, 185);

      // Brand name
      ctx.textAlign = 'left';
      ctx.font = 'bold 36px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(brandName || 'Brainy', 200, 165);

      // Subtitle
      ctx.font = '20px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('Generado con Brainy AI', 200, 200);

      // Content area
      const contentPadding = 80;
      const contentTop = 300;
      const contentWidth = canvas.width - contentPadding * 2;

      // Content background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(contentPadding, contentTop, contentWidth, canvas.height - contentTop - 200, 24);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Title if present
      let textY = contentTop + 60;
      if (title) {
        ctx.font = 'bold 28px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#00f5ff';
        ctx.fillText(title, contentPadding + 40, textY);
        textY += 50;
      }

      // Content text (word wrap)
      ctx.font = '24px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#e5e7eb';
      
      const words = content.split(' ');
      let line = '';
      const lineHeight = 38;
      const maxWidth = contentWidth - 80;

      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), contentPadding + 40, textY);
          line = word + ' ';
          textY += lineHeight;
          
          // Stop if we exceed content area
          if (textY > canvas.height - 350) {
            ctx.fillText('...', contentPadding + 40, textY);
            break;
          }
        } else {
          line = testLine;
        }
      }
      if (line.trim() && textY <= canvas.height - 350) {
        ctx.fillText(line.trim(), contentPadding + 40, textY);
      }

      // Hashtags at bottom
      if (hashtags?.length) {
        const hashtagY = canvas.height - 180;
        ctx.font = '20px Inter, system-ui, sans-serif';
        let hashtagX = contentPadding + 40;
        
        for (const tag of hashtags.slice(0, 5)) {
          const tagWidth = ctx.measureText(tag).width + 30;
          
          if (hashtagX + tagWidth > canvas.width - contentPadding) break;
          
          // Tag background
          ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
          ctx.beginPath();
          ctx.roundRect(hashtagX, hashtagY - 25, tagWidth, 40, 20);
          ctx.fill();
          
          // Tag text
          ctx.fillStyle = '#a855f7';
          ctx.fillText(tag, hashtagX + 15, hashtagY + 5);
          
          hashtagX += tagWidth + 12;
        }
      }

      // Footer
      ctx.font = '18px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      const footerText = `Creado con Brainy • ${new Date().toLocaleDateString('es-ES')}`;
      ctx.fillText(footerText, canvas.width / 2, canvas.height - 60);

      // Download the image
      const link = document.createElement('a');
      link.download = `${title || 'contenido-brainy'}-${Date.now()}.png`;
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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Descargar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToImage}>
          <Image className="w-4 h-4 mr-2" />
          Descargar Imagen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Download className="w-4 h-4 mr-2" />
          Copiar texto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContentExporter;
