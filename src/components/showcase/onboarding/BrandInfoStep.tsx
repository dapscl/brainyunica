import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Target, TrendingUp } from 'lucide-react';

interface BrandInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const BrandInfoStep = ({ data, onUpdate }: BrandInfoStepProps) => {
  const industries = [
    'Tecnología', 'E-commerce', 'Salud y Bienestar', 'Educación', 
    'Finanzas', 'Retail', 'Servicios Profesionales', 'Entretenimiento',
    'Viajes y Turismo', 'Alimentos y Bebidas', 'Moda', 'Inmobiliario'
  ];

  const objectives = [
    { id: 'awareness', label: 'Aumentar Brand Awareness', icon: '📢' },
    { id: 'leads', label: 'Generar Leads Calificados', icon: '🎯' },
    { id: 'sales', label: 'Incrementar Ventas Online', icon: '💰' },
    { id: 'engagement', label: 'Mejorar Engagement', icon: '❤️' },
    { id: 'retention', label: 'Fidelización de Clientes', icon: '🔄' },
    { id: 'traffic', label: 'Aumentar Tráfico Web', icon: '🚀' }
  ];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const toggleObjective = (objectiveId: string) => {
    const current = data.objectives || [];
    const updated = current.includes(objectiveId)
      ? current.filter((id: string) => id !== objectiveId)
      : [...current, objectiveId];
    handleChange('objectives', updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Activar Decision Layer™</h2>
        <p className="text-muted-foreground">
          Brainy necesita entender tu negocio para empezar a dirigir tu marketing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identidad del Sistema</CardTitle>
          <CardDescription>Con estos datos, Brainy define la estrategia inicial de tu marca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Nombre de la Marca *</Label>
            <Input 
              id="brandName"
              placeholder="Ej: TechStart Solutions"
              value={data.brandName || ''}
              onChange={(e) => handleChange('brandName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web</Label>
            <Input 
              id="website"
              type="url"
              placeholder="https://ejemplo.com"
              value={data.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industria *</Label>
            <Select value={data.industry || ''} onValueChange={(value) => handleChange('industry', value)}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Selecciona tu industria" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Breve *</Label>
            <Textarea 
              id="description"
              placeholder="Describe tu marca, productos o servicios en pocas palabras..."
              rows={4}
              value={data.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Brainy usará esto para definir tu narrativa y tomar decisiones de contenido
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Objetivos Estratégicos
          </CardTitle>
          <CardDescription>Define las prioridades que Brainy gobernará por ti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                onClick={() => toggleObjective(objective.id)}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                  ${(data.objectives || []).includes(objective.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{objective.icon}</span>
                  <span className="font-medium">{objective.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Inversión Publicitaria Mensual
          </CardTitle>
          <CardDescription>Brainy gobernará la distribución de este presupuesto en todos tus canales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'starter', label: 'Hasta €5K/mes', badge: 'Starter' },
              { value: 'professional', label: '€5K - €25K/mes', badge: 'Professional' },
              { value: 'enterprise', label: '€25K+/mes', badge: 'Enterprise' }
            ].map((tier) => (
              <div
                key={tier.value}
                onClick={() => handleChange('adSpendTier', tier.value)}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md text-center
                  ${data.adSpendTier === tier.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <Badge variant="outline" className="mb-2">{tier.badge}</Badge>
                <p className="font-medium">{tier.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandInfoStep;
