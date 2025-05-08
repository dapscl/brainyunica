
/**
 * Servicio para verificar direcciones de correo electrónico
 */

export type VerificationResult = {
  isValid: boolean;
  score?: number;
  reason?: string;
  domain?: {
    hasValidMx: boolean;
    hasValidSpf: boolean;
  };
};

export type VerificationService = 'hunter' | 'clearout' | 'neverbounce' | 'manual';

// Simulación de verificación para demo
export const verifyEmail = async (
  email: string, 
  service: VerificationService = 'hunter', 
  apiKey?: string
): Promise<VerificationResult> => {
  // En una implementación real, aquí conectaríamos con el servicio de verificación
  console.log(`Verificando ${email} usando ${service}${apiKey ? ' con API key' : ''}`);
  
  // Para esta demo, simulamos un resultado basado en características del correo
  const isGmail = email.endsWith('@gmail.com');
  const isHotmail = email.endsWith('@hotmail.com');
  const isOutlook = email.endsWith('@outlook.com');
  const isYahoo = email.endsWith('@yahoo.com');
  
  // Común dominios comerciales tienen mayor probabilidad de ser válidos
  const isCommonBusinessDomain = /\.com$|\.co$|\.io$|\.es$|\.mx$/.test(email);
  
  // Simulamos diferentes resultados según el servicio seleccionado
  switch (service) {
    case 'hunter':
      return {
        isValid: Math.random() > 0.2, // 80% probabilidad de ser válido
        score: Math.floor(Math.random() * 100),
        domain: {
          hasValidMx: isCommonBusinessDomain || isGmail,
          hasValidSpf: Math.random() > 0.3
        }
      };
      
    case 'clearout':
      return {
        isValid: isGmail || isOutlook || isCommonBusinessDomain,
        reason: isGmail ? 'valid_email' : 'syntax_error',
        domain: {
          hasValidMx: isCommonBusinessDomain || isGmail || isOutlook,
          hasValidSpf: isCommonBusinessDomain
        }
      };
      
    case 'neverbounce':
      return {
        isValid: !isHotmail && !isYahoo,
        score: isGmail ? 95 : isOutlook ? 85 : Math.floor(Math.random() * 100),
        reason: isHotmail ? 'disposable_email' : undefined
      };
      
    case 'manual':
    default:
      // Para verificación manual, siempre devolvemos incierto para que sea verificado manualmente
      return {
        isValid: true,
        reason: 'pending_manual_verification'
      };
  }
};
