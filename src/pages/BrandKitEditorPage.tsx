import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/layout/AppHeader";
import { DynamicBreadcrumb } from "@/components/navigation/DynamicBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPaletteEditor } from "@/components/brandkit/ColorPaletteEditor";
import { TypographyEditor } from "@/components/brandkit/TypographyEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Palette, Type, Image, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrandKitEditorPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandKit, setBrandKit] = useState<any>(null);
  const [brand, setBrand] = useState<any>(null);

  useEffect(() => {
    loadBrandKit();
  }, [brandId]);

  const loadBrandKit = async () => {
    try {
      const { data: brandData } = await supabase
        .from("brands")
        .select("*")
        .eq("id", brandId)
        .single();

      if (brandData) setBrand(brandData);

      const { data: kitData } = await supabase
        .from("brand_kits")
        .select("*")
        .eq("brand_id", brandId)
        .maybeSingle();

      if (kitData) {
        setBrandKit(kitData);
      } else {
        // Create default brand kit
        const { data: newKit } = await supabase
          .from("brand_kits")
          .insert({
            brand_id: brandId,
            color_palette: { primary: [], secondary: [], accent: [] },
            typography: { primary: {}, secondary: {} },
          })
          .select()
          .single();
        setBrandKit(newKit);
      }
    } catch (error) {
      console.error("Error loading brand kit:", error);
      toast.error("Error al cargar el brand kit");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("brand_kits")
        .update(brandKit)
        .eq("id", brandKit.id);

      if (error) throw error;
      toast.success("Brand kit guardado correctamente");
    } catch (error) {
      console.error("Error saving brand kit:", error);
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <DynamicBreadcrumb />
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Brand Kit: {brand?.name}</h1>
            <p className="text-muted-foreground">
              Define la identidad visual de tu marca
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-2" />
              Colores
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              Tipografía
            </TabsTrigger>
            <TabsTrigger value="assets">
              <Image className="h-4 w-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="guidelines">
              <FileText className="h-4 w-4 mr-2" />
              Guía de Estilo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <ColorPaletteEditor
              palette={brandKit?.color_palette || { primary: [], secondary: [], accent: [] }}
              onChange={(palette) =>
                setBrandKit({ ...brandKit, color_palette: palette })
              }
            />
          </TabsContent>

          <TabsContent value="typography">
            <TypographyEditor
              typography={brandKit?.typography || { primary: {}, secondary: {} }}
              onChange={(typography) =>
                setBrandKit({ ...brandKit, typography })
              }
            />
          </TabsContent>

          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>Librería de Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestiona logos, iconos y otros recursos visuales de tu marca.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines">
            <Card>
              <CardHeader>
                <CardTitle>Guía de Estilo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Define reglas y mejores prácticas para el uso de tu identidad visual.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
