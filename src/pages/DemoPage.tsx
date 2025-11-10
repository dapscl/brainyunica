import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import demoTechstartImage from '@/assets/demo-techstart.jpg';
import demoEcogreenImage from '@/assets/demo-ecogreen.jpg';
import demoFitlifeImage from '@/assets/demo-fitlife.jpg';
import demoTechProduct1 from '@/assets/demo-tech-product-1.jpg';
import demoTechProduct2 from '@/assets/demo-tech-product-2.jpg';
import demoEcoProduct1 from '@/assets/demo-eco-product-1.jpg';
import demoEcoProduct2 from '@/assets/demo-eco-product-2.jpg';
import demoFitness1 from '@/assets/demo-fitness-1.jpg';
import demoFitness2 from '@/assets/demo-fitness-2.jpg';

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

      // Declarar variables que se usarán en múltiples secciones
      let org: { id: string };
      let brands: Array<{ data: { id: string } | null; error: any }>;
      let projects: Array<{ data: { id: string } | null; error: any }>;

      // 0. Limpiar TODAS las organizaciones demo anteriores
      setProgress(prev => [...prev, 'Limpiando demos anteriores...']);
      try {
        const { data: existingOrgs } = await supabase
          .from('organizations')
          .select('id, name')
          .or('name.ilike.%Demo Marketing Agency%,name.ilike.%demo-agency%,slug.ilike.%demo-agency%');
        
        if (existingOrgs && existingOrgs.length > 0) {
          setProgress(prev => [...prev, `Encontradas ${existingOrgs.length} organizaciones demo anteriores, eliminando...`]);
          
          // Eliminar datos demo relacionados antes de borrar la org
          for (const o of existingOrgs) {
            // 1) Borrar marcas de la organización demo
            const { error: delBrandsErr } = await supabase
              .from('brands')
              .delete()
              .eq('organization_id', o.id);
            if (delBrandsErr) {
              console.error(`Error eliminando marcas de ${o.name}:`, delBrandsErr);
            }

            // 2) Borrar membresía del usuario para esa organización (mantener permiso owner para borrar la org)
            const { error: delMemberErr } = await supabase
              .from('organization_members')
              .delete()
              .eq('organization_id', o.id)
              .eq('user_id', user.id);
            if (delMemberErr) {
              console.warn(`Aviso eliminando membership en ${o.name}:`, delMemberErr);
            }

            // 3) Borrar la organización (el policy usa owner_id)
            const { error: deleteError } = await supabase
              .from('organizations')
              .delete()
              .eq('id', o.id);
            if (deleteError) {
              console.error(`Error eliminando organización ${o.name}:`, deleteError);
            }
          }
          
          setProgress(prev => [...prev, `✓ Organizaciones demo anteriores eliminadas`]);
        } else {
          setProgress(prev => [...prev, '✓ No hay demos anteriores']);
        }
      } catch (error: any) {
        console.error('Error limpiando demos:', error);
        setProgress(prev => [...prev, `⚠️ Aviso: ${error.message}`]);
      }

      // 1. Crear Organización
      setProgress(prev => [...prev, 'Creando organización de prueba...']);
      try {
        const orgSlug = 'demo-agency-' + Date.now();
        const { error: orgInsertError } = await supabase
          .from('organizations')
          .insert({
            name: 'Demo Marketing Agency',
            slug: orgSlug,
            owner_id: user.id,
            logo_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
          });

        if (orgInsertError) {
          throw new Error(`Error insertando organización: ${orgInsertError.message} (${orgInsertError.code})`);
        }

        // Recuperar organización recién creada evitando RETURNING bajo RLS
        const { data: orgData, error: orgSelectError } = await supabase
          .from('organizations')
          .select('id')
          .eq('slug', orgSlug)
          .single();

        if (orgSelectError) {
          throw new Error(`Error recuperando organización: ${orgSelectError.message} (${orgSelectError.code})`);
        }

        org = orgData;
      
        // Agregar al usuario como miembro de la organización
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            organization_id: org.id,
            user_id: user.id,
            role: 'owner'
          });
        
        if (memberError) {
          throw new Error(`Error agregando miembro a organización: ${memberError.message} (${memberError.code})`);
        }
        setProgress(prev => [...prev, '✓ Organización creada']);
      } catch (error: any) {
        setProgress(prev => [...prev, `❌ Error en Organización: ${error.message}`]);
        throw error;
      }

      // 2. Crear Marcas
      setProgress(prev => [...prev, 'Creando marcas de ejemplo...']);
      try {
        // Definir marcas deseadas con slugs fijos por organización
        const desiredBrands = [
          {
            name: 'TechStart Solutions',
            slug: 'techstart',
            industry: 'Tecnología',
            logo_url: demoTechstartImage,
            website: 'https://techstart.demo'
          },
          {
            name: 'EcoGreen Products',
            slug: 'ecogreen',
            industry: 'Sostenibilidad',
            logo_url: demoEcogreenImage,
            website: 'https://ecogreen.demo'
          },
          {
            name: 'FitLife Gym',
            slug: 'fitlife',
            industry: 'Fitness',
            logo_url: demoFitlifeImage,
            website: 'https://fitlife.demo'
          }
        ];

        // Crear o reutilizar marcas evitando duplicados por (organization_id, slug)
        const createdOrExisting: Array<{ data: { id: string } | null; error: any }> = [];
        for (const b of desiredBrands) {
          // 1) Buscar existente
          const { data: existing, error: findErr } = await supabase
            .from('brands')
            .select('id')
            .eq('organization_id', org.id)
            .eq('slug', b.slug)
            .maybeSingle();
          if (findErr) {
            console.warn('Aviso buscando marca existente', b.slug, findErr);
          }

          if (existing?.id) {
            createdOrExisting.push({ data: { id: existing.id }, error: null });
            continue;
          }

          // 2) Insertar si no existe
          const { error: insertErr } = await supabase.from('brands').insert({
            organization_id: org.id,
            name: b.name,
            slug: b.slug,
            industry: b.industry,
            logo_url: b.logo_url,
            website: b.website,
          });
          if (insertErr) {
            throw new Error(`Error insertando marca ${b.slug}: ${insertErr.message} (${insertErr.code})`);
          }

          // 3) Recuperar id con SELECT separado (patrón RLS)
          const { data: inserted, error: selectErr } = await supabase
            .from('brands')
            .select('id')
            .eq('organization_id', org.id)
            .eq('slug', b.slug)
            .single();
          if (selectErr) {
            throw new Error(`Error recuperando marca ${b.slug}: ${selectErr.message} (${selectErr.code})`);
          }
          createdOrExisting.push({ data: { id: inserted.id }, error: null });
        }

        brands = createdOrExisting;
        setProgress(prev => [...prev, '✓ 3 Marcas listas (sin duplicados)']);

        // 3. Crear Brand Kits
        setProgress(prev => [...prev, 'Configurando brand kits...']);
        const brandKitInserts = await Promise.all(brands.map(({ data: brand }) => 
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
        
        const failedKit = brandKitInserts.find(k => k.error);
        if (failedKit?.error) {
          throw new Error(`Error creando brand kit: ${failedKit.error.message} (${failedKit.error.code})`);
        }
        setProgress(prev => [...prev, '✓ Brand kits configurados']);
      } catch (error: any) {
        setProgress(prev => [...prev, `❌ Error en Marcas/Brand Kits: ${error.message}`]);
        throw error;
      }

      // 4. Crear Proyectos
      setProgress(prev => [...prev, 'Creando proyectos...']);
      try {
        // Insertar proyectos sin RETURNING para evitar conflictos con RLS
        const projectsData = [
          {
            brand_id: brands[0].data!.id,
            name: 'Campaña Q1 2025',
            description: 'Campaña de lanzamiento de nuevo producto',
            status: 'in_progress',
            created_by: user.id,
            start_date: '2025-01-01',
            end_date: '2025-03-31'
          },
          {
            brand_id: brands[1].data!.id,
            name: 'Mes de la Sostenibilidad',
            description: 'Contenido educativo sobre reciclaje',
            status: 'in_progress',
            created_by: user.id,
            start_date: '2025-02-01',
            end_date: '2025-02-28'
          },
          {
            brand_id: brands[2].data!.id,
            name: 'Reto 30 Días',
            description: 'Challenge fitness en redes sociales',
            status: 'draft',
            created_by: user.id,
            start_date: '2025-03-01',
            end_date: '2025-03-30'
          }
        ];

        const projectInserts = await Promise.all(
          projectsData.map(project => supabase.from('projects').insert(project))
        );

        const failedProject = projectInserts.find(p => p.error);
        if (failedProject?.error) {
          throw new Error(`Error insertando proyecto: ${failedProject.error.message} (${failedProject.error.code})`);
        }

        // Recuperar proyectos recién creados
        projects = await Promise.all([
          supabase.from('projects').select('id').eq('brand_id', brands[0].data!.id).eq('name', 'Campaña Q1 2025').single(),
          supabase.from('projects').select('id').eq('brand_id', brands[1].data!.id).eq('name', 'Mes de la Sostenibilidad').single(),
          supabase.from('projects').select('id').eq('brand_id', brands[2].data!.id).eq('name', 'Reto 30 Días').single()
        ]);

        const failedProjectSelect = projects.find(p => p.error);
        if (failedProjectSelect?.error) {
          throw new Error(`Error recuperando proyecto: ${failedProjectSelect.error.message} (${failedProjectSelect.error.code})`);
        }
        setProgress(prev => [...prev, '✓ 3 Proyectos creados']);
      } catch (error: any) {
        setProgress(prev => [...prev, `❌ Error en Proyectos: ${error.message}`]);
        throw error;
      }

      // 5. Crear Contenido
      setProgress(prev => [...prev, 'Generando contenido de ejemplo...']);
      try {
        const contentItems = [
          {
            project_id: projects[0].data!.id,
            brand_id: brands[0].data!.id,
            title: '🚀 Lanzamiento Producto Innovador',
            post_text: '¡Estamos emocionados de presentar nuestra nueva solución tecnológica! 💻 Descubre cómo puede transformar tu negocio. #TechInnovation #NewProduct',
            content_type: 'post',
            status: 'published',
            social_platforms: ['facebook', 'instagram', 'linkedin'],
            media_urls: [demoTechProduct1],
            created_by: user.id,
            scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          },
          {
            project_id: projects[0].data!.id,
            brand_id: brands[0].data!.id,
            title: '💻 Nuevo Workspace Digital',
            post_text: 'Transforma tu espacio de trabajo con nuestras herramientas de última generación. Productividad al máximo nivel 🚀 #WorkSmart #TechTools',
            content_type: 'post',
            status: 'draft',
            social_platforms: ['linkedin', 'twitter'],
            media_urls: [demoTechProduct2],
            created_by: user.id,
            scheduled_date: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString()
          },
          {
            project_id: projects[1].data!.id,
            brand_id: brands[1].data!.id,
            title: '🌱 Tips de Reciclaje',
            post_text: '¿Sabías que reciclar correctamente puede reducir tu huella de carbono hasta un 50%? 🌍 Aquí te compartimos 5 tips esenciales. #EcoFriendly #Sustainability',
            content_type: 'post',
            status: 'draft',
            social_platforms: ['instagram', 'twitter'],
            media_urls: [demoEcoProduct1],
            created_by: user.id,
            scheduled_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
          },
          {
            project_id: projects[1].data!.id,
            brand_id: brands[1].data!.id,
            title: '♻️ Zero Waste Lifestyle',
            post_text: 'Pequeños cambios, gran impacto. Descubre cómo nuestros productos reutilizables pueden ayudarte a reducir tu huella ambiental 🌿 #ZeroWaste #Sustainable',
            content_type: 'post',
            status: 'scheduled',
            social_platforms: ['facebook', 'instagram'],
            media_urls: [demoEcoProduct2],
            created_by: user.id,
            scheduled_date: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString()
          },
          {
            project_id: projects[2].data!.id,
            brand_id: brands[2].data!.id,
            title: '💪 Día 1 del Reto',
            post_text: '¡Bienvenidos al Reto 30 Días! 🏋️ Hoy empezamos con una rutina básica de calentamiento. ¿Estás listo para transformarte? #FitnessChallenge #FitLife',
            content_type: 'post',
            status: 'scheduled',
            social_platforms: ['facebook', 'instagram'],
            media_urls: [demoFitness1],
            created_by: user.id,
            scheduled_date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
          },
          {
            project_id: projects[2].data!.id,
            brand_id: brands[2].data!.id,
            title: '🥗 Nutrición para el Éxito',
            post_text: 'La transformación empieza en la cocina. Descubre cómo preparar tus comidas para alcanzar tus objetivos fitness 💪 #HealthyEating #MealPrep',
            content_type: 'post',
            status: 'published',
            social_platforms: ['instagram', 'facebook'],
            media_urls: [demoFitness2],
            created_by: user.id,
            scheduled_date: new Date(Date.now() + 84 * 60 * 60 * 1000).toISOString()
          }
        ];

        const contentInserts = await Promise.all(contentItems.map(item => 
          supabase.from('content_items').insert(item)
        ));

        const failedContent = contentInserts.find(c => c.error);
        if (failedContent?.error) {
          throw new Error(`Error creando contenido: ${failedContent.error.message} (${failedContent.error.code})`);
        }
        setProgress(prev => [...prev, '✓ Contenido generado']);
      } catch (error: any) {
        setProgress(prev => [...prev, `❌ Error en Contenido: ${error.message}`]);
        throw error;
      }

      // 6. Crear Templates
      setProgress(prev => [...prev, 'Creando plantillas...']);
      try {
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

        const templateInserts = await Promise.all(templates.map(template => 
          supabase.from('content_templates').insert(template)
        ));

        const failedTemplate = templateInserts.find(t => t.error);
        if (failedTemplate?.error) {
          throw new Error(`Error creando template: ${failedTemplate.error.message} (${failedTemplate.error.code})`);
        }
        setProgress(prev => [...prev, '✓ Plantillas creadas']);
      } catch (error: any) {
        setProgress(prev => [...prev, `❌ Error en Templates: ${error.message}`]);
        throw error;
      }

      // 7. Crear Media Library
      setProgress(prev => [...prev, 'Agregando archivos a biblioteca de medios...']);
      try {
        const mediaFiles = [
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'tech-product-smartphone.jpg',
            file_url: demoTechProduct1,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 2458000,
            width: 1920,
            height: 1080,
            category: 'products',
            tags: ['tecnología', 'smartphone', 'gadgets'],
            description: 'Smartphone moderno con gadgets tecnológicos'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'tech-workspace.jpg',
            file_url: demoTechProduct2,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 3124000,
            width: 1920,
            height: 1080,
            category: 'marketing',
            tags: ['workspace', 'código', 'desarrollo'],
            description: 'Espacio de trabajo tecnológico con múltiples pantallas'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'eco-recycling.jpg',
            file_url: demoEcoProduct1,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 1856000,
            width: 1024,
            height: 1024,
            category: 'products',
            tags: ['reciclaje', 'sostenibilidad', 'plantas'],
            description: 'Contenedores de reciclaje con plantas verdes'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'eco-bamboo-products.jpg',
            file_url: demoEcoProduct2,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 1456000,
            width: 1024,
            height: 1024,
            category: 'products',
            tags: ['bambú', 'zero-waste', 'reutilizable'],
            description: 'Productos reutilizables de bambú y vidrio'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'fitness-yoga.jpg',
            file_url: demoFitness1,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 2124000,
            width: 1080,
            height: 1920,
            category: 'marketing',
            tags: ['yoga', 'fitness', 'gimnasio'],
            description: 'Persona practicando yoga en gimnasio moderno'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'fitness-meal-prep.jpg',
            file_url: demoFitness2,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 1924000,
            width: 1024,
            height: 1024,
            category: 'products',
            tags: ['nutrición', 'meal-prep', 'saludable'],
            description: 'Preparación de comida saludable con vegetales frescos'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'brand-techstart.jpg',
            file_url: demoTechstartImage,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 2856000,
            width: 1920,
            height: 1080,
            category: 'team',
            tags: ['marca', 'tecnología', 'startup'],
            description: 'Logo y marca TechStart Solutions'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'brand-ecogreen.jpg',
            file_url: demoEcogreenImage,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 2456000,
            width: 1920,
            height: 1080,
            category: 'team',
            tags: ['marca', 'eco', 'sostenibilidad'],
            description: 'Logo y marca EcoGreen Products'
          },
          {
            organization_id: org.id,
            uploaded_by: user.id,
            file_name: 'brand-fitlife.jpg',
            file_url: demoFitlifeImage,
            file_type: 'image',
            mime_type: 'image/jpeg',
            file_size: 2656000,
            width: 1920,
            height: 1080,
            category: 'team',
            tags: ['marca', 'fitness', 'gym'],
            description: 'Logo y marca FitLife Gym'
          }
        ];

        const mediaInserts = await Promise.all(mediaFiles.map(file => 
          supabase.from('media_library').insert(file)
        ));

        const failedMedia = mediaInserts.find(m => m.error);
        if (failedMedia?.error) {
          throw new Error(`Error insertando media: ${failedMedia.error.message} (${failedMedia.error.code})`);
        }
        setProgress(prev => [...prev, '✓ Biblioteca de medios poblada']);
      } catch (error: any) {
        setProgress(prev => [...prev, `❌ Error en Media Library: ${error.message}`]);
        throw error;
      }

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
              <li>✓ 6 Publicaciones de ejemplo</li>
              <li>✓ 3 Plantillas de contenido</li>
              <li>✓ 9 Archivos en biblioteca de medios</li>
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
