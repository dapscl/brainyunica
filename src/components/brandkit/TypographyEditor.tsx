import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TypographyEditorProps {
  typography: {
    primary: { family?: string; weights?: number[] };
    secondary: { family?: string; weights?: number[] };
  };
  onChange: (typography: any) => void;
}

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald',
  'Raleway', 'Poppins', 'Playfair Display', 'Merriweather', 'Nunito',
  'Ubuntu', 'Bebas Neue', 'Crimson Text', 'Work Sans', 'DM Sans',
];

const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const TypographyEditor = ({ typography, onChange }: TypographyEditorProps) => {
  const [primaryFont, setPrimaryFont] = useState(typography.primary?.family || 'Inter');
  const [secondaryFont, setSecondaryFont] = useState(typography.secondary?.family || 'Roboto');

  useEffect(() => {
    // Load Google Fonts
    const loadFont = (fontFamily: string) => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };

    loadFont(primaryFont);
    loadFont(secondaryFont);
  }, [primaryFont, secondaryFont]);

  const handlePrimaryChange = (family: string) => {
    setPrimaryFont(family);
    onChange({
      ...typography,
      primary: { family, weights: [400, 500, 600, 700] },
    });
    toast.success('Fuente primaria actualizada');
  };

  const handleSecondaryChange = (family: string) => {
    setSecondaryFont(family);
    onChange({
      ...typography,
      secondary: { family, weights: [400, 500, 600] },
    });
    toast.success('Fuente secundaria actualizada');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipografía Primaria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Fuente</Label>
            <Select value={primaryFont} onValueChange={handlePrimaryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOOGLE_FONTS.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-6 border rounded-lg bg-muted/50">
            <p
              style={{ fontFamily: primaryFont }}
              className="text-4xl font-bold mb-2"
            >
              The quick brown fox
            </p>
            <p
              style={{ fontFamily: primaryFont }}
              className="text-lg"
            >
              Jumps over the lazy dog
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipografía Secundaria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Fuente</Label>
            <Select value={secondaryFont} onValueChange={handleSecondaryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOOGLE_FONTS.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-6 border rounded-lg bg-muted/50">
            <p
              style={{ fontFamily: secondaryFont }}
              className="text-2xl font-semibold mb-2"
            >
              The quick brown fox
            </p>
            <p
              style={{ fontFamily: secondaryFont }}
              className="text-base"
            >
              Jumps over the lazy dog. 1234567890
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplo Combinado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h1 style={{ fontFamily: primaryFont }} className="text-3xl font-bold">
              Heading con {primaryFont}
            </h1>
            <p style={{ fontFamily: secondaryFont }} className="text-base">
              Este es un párrafo de ejemplo usando {secondaryFont} como fuente secundaria.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
