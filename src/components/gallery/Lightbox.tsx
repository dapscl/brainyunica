import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface LightboxProps {
  images: Array<{
    id: string;
    file_url: string;
    file_name: string;
    description?: string;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const Lightbox = ({ images, currentIndex, isOpen, onClose }: LightboxProps) => {
  const [index, setIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setIndex(currentIndex);
    setZoom(1);
  }, [currentIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, index]);

  const handlePrevious = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleDownload = () => {
    const currentImage = images[index];
    const link = document.createElement('a');
    link.href = currentImage.file_url;
    link.download = currentImage.file_name;
    link.click();
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[index];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Zoom and download controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/60 rounded-lg p-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className="text-white px-3 flex items-center text-sm">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <div className="w-px bg-white/20 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/60 text-white px-4 py-2 rounded-lg text-sm">
              {index + 1} / {images.length}
            </div>
          )}

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-12 overflow-auto">
            <img
              src={currentImage.file_url}
              alt={currentImage.description || currentImage.file_name}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          {/* Image info */}
          {currentImage.description && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 bg-black/60 text-white px-4 py-2 rounded-lg text-sm max-w-md text-center">
              {currentImage.description}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
