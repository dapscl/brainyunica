import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DemoPage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const navigate = useNavigate();

  const createDemoData = async () => {
    setLoading(true);
    setProgress([]);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión primero');
        navigate('/auth');
        return;
      }

      // Verificar si el usuario tiene rol admin
      setProgress(prev => [...prev, 'Verificando permisos...']);
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!userRole) {
        // Si no es admin, crear el rol admin para este usuario
        setProgress(prev => [...prev, 'Configurando permisos de administrador...']);
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'admin'
          });

        if (roleError) {
          toast.error('No tienes permisos para crear datos de prueba. Contacta al administrador del sistema.');
          setProgress(prev => [...prev, '❌ Error: Se requieren permisos de administrador']);
          setLoading(false);
          return;
        }
        setProgress(prev => [...prev, '✓ Permisos configurados']);
      } else {
        setProgress(prev => [...prev, '✓ Permisos verificados']);
      }

      // 1. Crear Organización
      setProgress(prev => [...prev, 'Creando organización de prueba...']);
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Demo Marketing Agency',
          slug: 'demo-agency-' + Date.now(),
          owner_id: user.id,
          logo_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
        })
        .select()
        .single();

      if (orgError) throw orgError;
      setProgress(prev => [...prev, '✓ Organización creada']);

      // 2. Crear Marcas
      setProgress(prev => [...prev, 'Creando marcas de ejemplo...']);
      const brands = await Promise.all([
        supabase.from('brands').insert({
          organization_id: org.id,
          name: 'TechStart Solutions',
          slug: 'techstart-' + Date.now(),
          industry: 'Tecnología',
          logo_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
          website: 'https://techstart.demo'
        }).select().single(),
        supabase.from('brands').insert({
          organization_id: org.id,
          name: 'EcoGreen Products',
          slug: 'ecogreen-' + Date.now(),
          industry: 'Sostenibilidad',
          logo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
          website: 'https://ecogreen.demo'
        }).select().single(),
        supabase.from('brands').insert({
          organization_id: org.id,
          name: 'FitLife Gym',
          slug: 'fitlife-' + Date.now(),
          industry: 'Fitness',
          logo_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
          website: 'https://fitlife.demo'
        }).select().single()
      ]);

      if (brands.some(b => b.error)) throw new Error('Error creando marcas');
      setProgress(prev => [...prev, '✓ 3 Marcas creadas']);

      // 3. Crear Brand Kits
      setProgress(prev => [...prev, 'Configurando brand kits...']);
      await Promise.all(brands.map(({ data: brand }) => 
        supabase.from('brand_kits').insert({
          brand_id: brand!.id,
          primary_color: '#3B82F6',
          secondary_color: '#8B5CF6',
          accent_color: '#F59E0B',
          primary_font_name: 'Inter',
          secondary_font_name: 'Roboto',
          brand_guidelines: 'Mantener un tono profesional y cercano. Usar imágenes de alta calidad.'
        })
      ));
      setProgress(prev => [...prev, '✓ Brand kits configurados']);

      // 4. Crear Proyectos
      setProgress(prev => [...prev, 'Creando proyectos...']);
      const projects = await Promise.all([
        supabase.from('projects').insert({
          brand_id: brands[0].data!.id,
          name: 'Campaña Q1 2025',
          description: 'Campaña de lanzamiento de nuevo producto',
          status: 'active',
          created_by: user.id,
          start_date: '2025-01-01',
          end_date: '2025-03-31'
        }).select().single(),
        supabase.from('projects').insert({
          brand_id: brands[1].data!.id,
          name: 'Mes de la Sostenibilidad',
          description: 'Contenido educativo sobre reciclaje',
          status: 'active',
          created_by: user.id,
          start_date: '2025-02-01',
          end_date: '2025-02-28'
        }).select().single(),
        supabase.from('projects').insert({
          brand_id: brands[2].data!.id,
          name: 'Reto 30 Días',
          description: 'Challenge fitness en redes sociales',
          status: 'draft',
          created_by: user.id,
          start_date: '2025-03-01',
          end_date: '2025-03-30'
        }).select().single()
      ]);

      if (projects.some(p => p.error)) throw new Error('Error creando proyectos');
      setProgress(prev => [...prev, '✓ 3 Proyectos creados']);

      // 5. Crear Contenido
      setProgress(prev => [...prev, 'Generando contenido de ejemplo...']);
      const contentItems = [
        {
          project_id: projects[0].data!.id,
          brand_id: brands[0].data!.id,
          title: '🚀 Lanzamiento Producto Innovador',
          post_text: '¡Estamos emocionados de presentar nuestra nueva solución tecnológica! 💻 Descubre cómo puede transformar tu negocio. #TechInnovation #NewProduct',
          content_type: 'post',
          status: 'published',
          social_platforms: ['facebook', 'instagram', 'linkedin'],
          media_urls: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c'],
          created_by: user.id,
          scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projects[1].data!.id,
          brand_id: brands[1].data!.id,
          title: '🌱 Tips de Reciclaje',
          post_text: '¿Sabías que reciclar correctamente puede reducir tu huella de carbono hasta un 50%? 🌍 Aquí te compartimos 5 tips esenciales. #EcoFriendly #Sustainability',
          content_type: 'post',
          status: 'draft',
          social_platforms: ['instagram', 'twitter'],
          media_urls: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'],
          created_by: user.id,
          scheduled_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projects[2].data!.id,
          brand_id: brands[2].data!.id,
          title: '💪 Día 1 del Reto',
          post_text: '¡Bienvenidos al Reto 30 Días! 🏋️ Hoy empezamos con una rutina básica de calentamiento. ¿Estás listo para transformarte? #FitnessChallenge #FitLife',
          content_type: 'post',
          status: 'scheduled',
          social_platforms: ['facebook', 'instagram'],
          media_urls: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b'],
          created_by: user.id,
          scheduled_date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
        }
      ];

      await Promise.all(contentItems.map(item => 
        supabase.from('content_items').insert(item)
      ));
      setProgress(prev => [...prev, '✓ Contenido generado']);

      // 6. Crear Templates
      setProgress(prev => [...prev, 'Creando plantillas...']);
      const templates = [
        {
          organization_id: org.id,
          created_by: user.id,
          name: 'Post de Lanzamiento',
          description: 'Template para anunciar nuevos productos',
          category: 'product_launch',
          platform: 'instagram',
          content: '🎉 ¡Novedad! Presentamos {{product_name}} 🚀\n\n{{description}}\n\n✨ Características principales:\n{{features}}\n\n👉 {{cta}}\n\n{{hashtags}}',
          tags: ['producto', 'lanzamiento', 'novedad'],
          is_public: false
        },
        {
          organization_id: org.id,
          created_by: user.id,
          name: 'Tip Educativo',
          description: 'Para compartir consejos útiles',
          category: 'educational',
          platform: 'facebook',
          content: '💡 Tip del día: {{tip_title}}\n\n{{tip_content}}\n\n¿Lo sabías? {{fact}}\n\n{{cta}}\n\n{{hashtags}}',
          tags: ['educativo', 'tips', 'consejos'],
          is_public: true
        },
        {
          organization_id: org.id,
          created_by: user.id,
          name: 'Testimonio Cliente',
          description: 'Para compartir reseñas de clientes',
          category: 'testimonial',
          platform: 'linkedin',
          content: '⭐ Testimonio de {{client_name}}\n\n"{{testimonial}}"\n\n{{client_role}} en {{client_company}}\n\n{{cta}}\n\n{{hashtags}}',
          tags: ['testimonio', 'reseña', 'cliente'],
          is_public: false
        }
      ];

      await Promise.all(templates.map(template => 
        supabase.from('content_templates').insert(template)
      ));
      setProgress(prev => [...prev, '✓ Plantillas creadas']);

      // 7. Crear Media Library
      setProgress(prev => [...prev, 'Agregando archivos a biblioteca de medios...']);
      const mediaFiles = [
        {
          organization_id: org.id,
          uploaded_by: user.id,
          file_name: 'hero-image.jpg',
          file_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
          file_type: 'image',
          mime_type: 'image/jpeg',
          file_size: 2458000,
          width: 1920,
          height: 1080,
          category: 'marketing',
          tags: ['hero', 'tecnología', 'oficina'],
          description: 'Imagen principal para campañas de tecnología'
        },
        {
          organization_id: org.id,
          uploaded_by: user.id,
          file_name: 'product-shot.jpg',
          file_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          file_type: 'image',
          mime_type: 'image/jpeg',
          file_size: 1856000,
          width: 1200,
          height: 800,
          category: 'products',
          tags: ['producto', 'audífonos', 'tecnología'],
          description: 'Fotografía de producto profesional'
        },
        {
          organization_id: org.id,
          uploaded_by: user.id,
          file_name: 'team-photo.jpg',
          file_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
          file_type: 'image',
          mime_type: 'image/jpeg',
          file_size: 3124000,
          width: 1600,
          height: 1200,
          category: 'team',
          tags: ['equipo', 'colaboración', 'oficina'],
          description: 'Foto de equipo trabajando'
        }
      ];

      await Promise.all(mediaFiles.map(file => 
        supabase.from('media_library').insert(file)
      ));
      setProgress(prev => [...prev, '✓ Biblioteca de medios poblada']);

      setProgress(prev => [...prev, '✅ ¡Demo completa! Redirigiendo...']);
      
      toast.success('Datos de prueba creados exitosamente');
      setTimeout(() => navigate('/organizations'), 2000);

    } catch (error: any) {
      console.error('Error creating demo data:', error);
      toast.error('Error al crear datos de prueba: ' + error.message);
      setProgress(prev => [...prev, '❌ Error: ' + error.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">🎨 Crear Demo del Sistema</CardTitle>
          <CardDescription>
            Genera datos de prueba para explorar todas las funcionalidades de la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Se creará:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ 1 Organización (Demo Marketing Agency)</li>
              <li>✓ 3 Marcas (TechStart, EcoGreen, FitLife)</li>
              <li>✓ 3 Brand Kits configurados</li>
              <li>✓ 3 Proyectos activos</li>
              <li>✓ 3 Publicaciones de ejemplo</li>
              <li>✓ 3 Plantillas de contenido</li>
              <li>✓ 3 Archivos en biblioteca de medios</li>
            </ul>
          </div>

          {progress.length > 0 && (
            <div className="bg-card border rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
              {progress.map((step, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  {step.startsWith('✓') ? (
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : step.startsWith('❌') ? (
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-primary mt-0.5 flex-shrink-0" />
                  )}
                  <span className={step.startsWith('❌') ? 'text-destructive' : ''}>{step.replace(/^[✓❌] /, '')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={createDemoData} 
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando Demo...
                </>
              ) : (
                '🚀 Crear Datos de Prueba'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/organizations')}
              disabled={loading}
              size="lg"
            >
              Ir a Organizaciones
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage;
