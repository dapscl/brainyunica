import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPaletteEditorProps {
  palette: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  onChange: (palette: any) => void;
}

export const ColorPaletteEditor = ({ palette, onChange }: ColorPaletteEditorProps) => {
  const [activeColor, setActiveColor] = useState('#000000');
  const [activeCategory, setActiveCategory] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const [copied, setCopied] = useState('');

  const addColor = (category: 'primary' | 'secondary' | 'accent') => {
    const newPalette = {
      ...palette,
      [category]: [...palette[category], activeColor],
    };
    onChange(newPalette);
    toast.success('Color añadido');
  };

  const removeColor = (category: 'primary' | 'secondary' | 'accent', index: number) => {
    const newPalette = {
      ...palette,
      [category]: palette[category].filter((_, i) => i !== index),
    };
    onChange(newPalette);
    toast.success('Color eliminado');
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    toast.success('Color copiado');
    setTimeout(() => setCopied(''), 2000);
  };

  const renderColorSection = (category: 'primary' | 'secondary' | 'accent', title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {palette[category].map((color, index) => (
            <div key={index} className="group relative">
              <div
                className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColor(category, index);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <p className="text-xs font-mono">{color}</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addColor(category)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Color
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selector de Color</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <HexColorPicker color={activeColor} onChange={setActiveColor} className="w-full" />
          <div className="flex items-center gap-2">
            <Input
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              className="font-mono"
            />
            <div
              className="w-12 h-12 rounded border-2 border-border"
              style={{ backgroundColor: activeColor }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {renderColorSection('primary', 'Colores Primarios')}
        {renderColorSection('secondary', 'Colores Secundarios')}
        {renderColorSection('accent', 'Colores de Acento')}
      </div>
    </div>
  );
};
