// Lista de dominios de correo personal bloqueados
// Solo se permiten correos corporativos/laborales

export const BLOCKED_EMAIL_DOMAINS = [
  // Gmail
  'gmail.com',
  'googlemail.com',
  
  // Microsoft
  'hotmail.com',
  'hotmail.es',
  'hotmail.co.uk',
  'outlook.com',
  'outlook.es',
  'live.com',
  'live.com.mx',
  'msn.com',
  
  // Yahoo
  'yahoo.com',
  'yahoo.es',
  'yahoo.com.mx',
  'yahoo.co.uk',
  'ymail.com',
  'rocketmail.com',
  
  // Apple
  'icloud.com',
  'me.com',
  'mac.com',
  
  // AOL
  'aol.com',
  'aim.com',
  
  // ProtonMail (personal)
  'protonmail.com',
  'proton.me',
  'pm.me',
  
  // Otros populares
  'mail.com',
  'email.com',
  'gmx.com',
  'gmx.es',
  'zoho.com',
  'yandex.com',
  'tutanota.com',
  'fastmail.com',
  
  // Temporales / Desechables
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'throwaway.email',
  
  // Regionales LATAM
  'terra.com',
  'terra.com.mx',
  'terra.com.ar',
  'uol.com.br',
  'bol.com.br',
  'ig.com.br',
  'latinmail.com',
  'starmedia.com',
];

/**
 * Verifica si un email usa un dominio personal bloqueado
 * @param email - Email a validar
 * @returns true si el dominio está bloqueado (personal), false si es corporativo
 */
export function isPersonalEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return true; // Sin dominio = inválido
  return BLOCKED_EMAIL_DOMAINS.includes(domain);
}

/**
 * Verifica si un email es corporativo (no bloqueado)
 * @param email - Email a validar
 * @returns true si es corporativo, false si es personal
 */
export function isCorporateEmail(email: string): boolean {
  return !isPersonalEmail(email);
}

/**
 * Obtiene el dominio de un email
 * @param email - Email
 * @returns dominio o null
 */
export function getEmailDomain(email: string): string | null {
  const parts = email.toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : null;
}
