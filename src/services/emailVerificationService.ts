
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
    hasDmarc?: boolean;
  };
  isDisposable?: boolean;
  isFreeProvider?: boolean;
  isRoleAccount?: boolean;
  statusCode?: number;
  errorMessage?: string;
};

export type VerificationService = 'hunter' | 'clearout' | 'neverbounce' | 'manual' | 'truemail';

// Lista de dominios populares de correo
const COMMON_EMAIL_DOMAINS = [
  'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 
  'protonmail.com', 'icloud.com', 'aol.com', 'zoho.com',
  'mail.com', 'gmx.com'
];

// Lista de dominios de correo temporales/desechables
const DISPOSABLE_DOMAINS = [
  'temp-mail.org', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'throwawaymail.com', 'yopmail.com', 'tempail.com', 'emailondeck.com'
];

/**
 * Verifica la sintaxis básica de un email
 */
export const isEmailSyntaxValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Verifica si un email usa un dominio desechable
 */
export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1].toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
};

/**
 * Verifica si un email es una cuenta de rol (no personal)
 */
export const isRoleAccount = (email: string): boolean => {
  const roleAccounts = ['info', 'admin', 'support', 'contact', 'sales', 'marketing', 'help', 'noreply', 'no-reply'];
  const localPart = email.split('@')[0].toLowerCase();
  return roleAccounts.includes(localPart);
};

/**
 * Verifica si es un proveedor de correo gratuito y común
 */
export const isFreeEmailProvider = (email: string): boolean => {
  const domain = email.split('@')[1].toLowerCase();
  return COMMON_EMAIL_DOMAINS.includes(domain);
};

/**
 * Servicio de verificación de email
 */
export const verifyEmail = async (
  email: string, 
  service: VerificationService = 'hunter', 
  apiKey?: string
): Promise<VerificationResult> => {
  // Validación sintáctica básica
  if (!isEmailSyntaxValid(email)) {
    return {
      isValid: false,
      reason: 'invalid_syntax',
      errorMessage: 'El formato del email no es válido'
    };
  }

  // Verificar si es un dominio desechable
  const isDisposable = isDisposableEmail(email);
  const isRole = isRoleAccount(email);
  const isFreeProvider = isFreeEmailProvider(email);
  
  console.log(`Verificando ${email} usando ${service}${apiKey ? ' con API key' : ''}`);
  console.log(`Características detectadas - Desechable: ${isDisposable}, Cuenta de rol: ${isRole}, Proveedor gratuito: ${isFreeProvider}`);
  
  // En una implementación real, aquí conectaríamos con el servicio de verificación
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
      // Hunter.io simula verificación básica con puntuación de confianza
      return {
        isValid: !isDisposable && Math.random() > 0.2, // 80% probabilidad de ser válido si no es desechable
        score: isDisposable ? 10 : isRole ? 40 : isFreeProvider ? 70 : Math.floor(Math.random() * 60) + 40,
        domain: {
          hasValidMx: isCommonBusinessDomain || isGmail,
          hasValidSpf: Math.random() > 0.3,
          hasDmarc: Math.random() > 0.5
        },
        isDisposable,
        isFreeProvider,
        isRoleAccount: isRole
      };
      
    case 'clearout':
      // Clearout simula más detalles sobre validez de dominio
      return {
        isValid: !isDisposable && (isGmail || isOutlook || isCommonBusinessDomain),
        reason: isDisposable ? 'disposable_email' : isRole ? 'role_based_email' : isGmail ? 'valid_email' : 'syntax_error',
        domain: {
          hasValidMx: isCommonBusinessDomain || isGmail || isOutlook,
          hasValidSpf: isCommonBusinessDomain,
          hasDmarc: isGmail || isOutlook
        },
        isDisposable,
        isFreeProvider,
        statusCode: isDisposable ? 215 : isRole ? 220 : 200
      };
      
    case 'neverbounce':
      // NeverBounce simula enfoque en puntuación de calidad
      return {
        isValid: !isDisposable && !isYahoo && !isRole,
        score: isDisposable ? 15 : isRole ? 30 : isGmail ? 95 : isOutlook ? 85 : Math.floor(Math.random() * 100),
        reason: isDisposable ? 'disposable_email' : isRole ? 'role_account' : isHotmail ? 'low_deliverability' : undefined,
        isDisposable,
        isFreeProvider
      };
      
    case 'truemail':
      // Truemail simula verificación técnica más profunda
      return {
        isValid: !isDisposable && Math.random() > 0.3,
        domain: {
          hasValidMx: isCommonBusinessDomain || isGmail || !isDisposable,
          hasValidSpf: !isDisposable && Math.random() > 0.4,
          hasDmarc: isGmail || isOutlook || Math.random() > 0.7
        },
        isDisposable,
        isRoleAccount: isRole,
        isFreeProvider,
        statusCode: isDisposable ? 400 : 200
      };
      
    case 'manual':
    default:
      // Para verificación manual, siempre devolvemos incierto para que sea verificado manualmente
      return {
        isValid: true,
        reason: 'pending_manual_verification',
        isFreeProvider,
        isRoleAccount: isRole
      };
  }
};

/**
 * Devuelve un mensaje legible sobre el resultado de la verificación
 */
export const getVerificationMessage = (result: VerificationResult): string => {
  if (!result.isValid) {
    if (result.reason === 'invalid_syntax') {
      return 'El formato del email no es válido';
    }
    if (result.reason === 'disposable_email') {
      return 'Este email usa un servicio temporal/desechable';
    }
    if (result.reason === 'role_based_email') {
      return 'Este email parece ser una cuenta de rol (no personal)';
    }
    if (result.errorMessage) {
      return result.errorMessage;
    }
    return 'Este email no parece ser válido';
  }
  
  if (result.reason === 'pending_manual_verification') {
    return 'Pendiente de verificación manual';
  }
  
  if (result.isDisposable) {
    return 'Email válido, pero usa un servicio desechable';
  }
  
  if (result.score !== undefined) {
    if (result.score > 90) {
      return 'Email válido (alta confianza)';
    }
    if (result.score > 70) {
      return 'Email probablemente válido';
    }
    if (result.score > 50) {
      return 'Email posiblemente válido';
    }
    return 'Email de baja confianza';
  }
  
  if (result.isRoleAccount) {
    return 'Email válido, pero es una cuenta de rol';
  }
  
  return 'Email verificado correctamente';
};
