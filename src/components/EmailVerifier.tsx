
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { verifyEmail, getVerificationMessage, VerificationService, VerificationResult } from '@/services/emailVerificationService';
import { useToast } from '@/hooks/use-toast';

interface EmailVerifierProps {
  onVerified?: (result: VerificationResult) => void;
  initialEmail?: string;
}

const EmailVerifier: React.FC<EmailVerifierProps> = ({ onVerified, initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [service, setService] = useState<VerificationService>('hunter');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email requerido',
        description: 'Por favor ingrese un email para verificar',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await verifyEmail(email, service, apiKey || undefined);
      setVerificationResult(result);
      
      if (onVerified) {
        onVerified(result);
      }

      toast({
        title: result.isValid ? 'Verificación completada' : 'Verificación fallida',
        description: getVerificationMessage(result),
        variant: result.isValid ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error al verificar email:', error);
      toast({
        title: 'Error en verificación',
        description: 'Ocurrió un error al intentar verificar el email. Intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = () => {
    if (!verificationResult) return null;
    
    if (verificationResult.isValid) {
      return <Check className="h-5 w-5 text-green-500" />;
    }
    
    if (verificationResult.reason === 'pending_manual_verification') {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    
    return <X className="h-5 w-5 text-red-500" />;
  };

  const getScoreBadgeColor = (score?: number) => {
    if (score === undefined) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificador de Email</CardTitle>
        <CardDescription>
          Verifica la validez y calidad de direcciones de email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium block mb-1">
            Email
          </label>
          <Input
            id="email"
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="service" className="text-sm font-medium block mb-1">
              Servicio de verificación
            </label>
            <Select value={service} onValueChange={(value) => setService(value as VerificationService)}>
              <SelectTrigger id="service">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hunter">Hunter.io</SelectItem>
                <SelectItem value="clearout">Clearout</SelectItem>
                <SelectItem value="neverbounce">NeverBounce</SelectItem>
                <SelectItem value="truemail">TrueMail</SelectItem>
                <SelectItem value="manual">Verificación manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="api-key" className="text-sm font-medium">
                API Key
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                className="h-6 text-xs"
              >
                {showApiKey ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            <Input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              placeholder="Ingrese su API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        {verificationResult && (
          <div className="mt-4 space-y-3 p-3 bg-muted/50 rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Estado:</p>
              <div className="flex items-center">
                {getStatusIcon()}
                <span className="ml-1 text-sm">
                  {verificationResult.isValid ? 'Válido' : 'Inválido'}
                </span>
              </div>
            </div>
            
            {verificationResult.score !== undefined && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Puntuación:</p>
                <Badge variant="outline" className={getScoreBadgeColor(verificationResult.score)}>
                  {verificationResult.score}/100
                </Badge>
              </div>
            )}
            
            {verificationResult.reason && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Razón:</p>
                <span className="text-sm">{verificationResult.reason}</span>
              </div>
            )}
            
            {verificationResult.domain && (
              <div>
                <p className="text-sm font-medium mb-1">Información de dominio:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${verificationResult.domain.hasValidMx ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Registro MX</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${verificationResult.domain.hasValidSpf ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Registro SPF</span>
                  </div>
                  {verificationResult.domain.hasDmarc !== undefined && (
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${verificationResult.domain.hasDmarc ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>DMARC</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {verificationResult.isDisposable !== undefined && verificationResult.isDisposable && (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Dominio de email desechable</span>
              </div>
            )}

            {verificationResult.isRoleAccount !== undefined && verificationResult.isRoleAccount && (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Cuenta de rol (no personal)</span>
              </div>
            )}
            
            <p className="text-sm border-t border-muted pt-2 mt-2">
              {getVerificationMessage(verificationResult)}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleVerify} 
          disabled={isVerifying || !email.trim()}
        >
          {isVerifying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Verificar Email
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailVerifier;
