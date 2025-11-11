import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building, Shield, CheckCircle2 } from 'lucide-react';

interface PaymentSetupStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PaymentSetupStep = ({ data, onUpdate }: PaymentSetupStepProps) => {
  const handleChange = (field: string, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Configuración de Pago</h2>
        <p className="text-muted-foreground">
          Configura tu método de pago para comenzar a usar la plataforma
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Pago Seguro con Stripe</p>
              <p className="text-sm text-muted-foreground">
                Tus datos de pago están encriptados y nunca se almacenan en nuestros servidores. 
                Procesamos pagos a través de Stripe, certificado PCI DSS Nivel 1.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Información de Tarjeta
          </CardTitle>
          <CardDescription>Ingresa los datos de tu tarjeta de crédito o débito</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
            <Input 
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={data.cardNumber || ''}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Fecha de Expiración *</Label>
              <Input 
                id="expiry"
                placeholder="MM/AA"
                value={data.expiry || ''}
                onChange={(e) => handleChange('expiry', e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC *</Label>
              <Input 
                id="cvc"
                placeholder="123"
                value={data.cvc || ''}
                onChange={(e) => handleChange('cvc', e.target.value)}
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
            <Input 
              id="cardName"
              placeholder="Como aparece en la tarjeta"
              value={data.cardName || ''}
              onChange={(e) => handleChange('cardName', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Información de Facturación
          </CardTitle>
          <CardDescription>Para emitir tus facturas mensuales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nombre de Empresa/Persona</Label>
            <Input 
              id="companyName"
              placeholder="Tu empresa o nombre completo"
              value={data.companyName || ''}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">RFC/NIF/Tax ID</Label>
            <Input 
              id="taxId"
              placeholder="Identificación fiscal"
              value={data.taxId || ''}
              onChange={(e) => handleChange('taxId', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingEmail">Email para Facturas *</Label>
            <Input 
              id="billingEmail"
              type="email"
              placeholder="facturas@empresa.com"
              value={data.billingEmail || ''}
              onChange={(e) => handleChange('billingEmail', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección Fiscal</Label>
            <Input 
              id="address"
              placeholder="Calle, número, código postal, ciudad, país"
              value={data.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Plan Seleccionado</span>
              <Badge variant="default" className="text-sm">
                {data.adSpendTier === 'starter' ? 'Starter' : 
                 data.adSpendTier === 'professional' ? 'Professional' : 
                 data.adSpendTier === 'enterprise' ? 'Enterprise' : 'No seleccionado'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Precio Base Mensual</span>
              <span className="text-lg font-bold">
                {data.adSpendTier === 'starter' ? '€297' : 
                 data.adSpendTier === 'professional' ? '€597' : 
                 data.adSpendTier === 'enterprise' ? '€997' : '€0'}/mes
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground p-3">
              <span>+ Porcentaje de Ad Spend</span>
              <span>
                {data.adSpendTier === 'starter' ? '3%' : 
                 data.adSpendTier === 'professional' ? '2.5%' : 
                 data.adSpendTier === 'enterprise' ? '2%' : '0%'}
              </span>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">14 días de prueba gratis incluidos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSetupStep;
