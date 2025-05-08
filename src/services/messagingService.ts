
/**
 * Servicio para el manejo de mensajes y seguimientos automatizados
 */

import { Lead } from '@/components/LeadCard';

export type MessageTemplate = {
  id: string;
  name: string;
  subject?: string;
  body: string;
  type: 'initial' | 'followup' | 'meeting' | 'custom';
};

export type FollowUpSchedule = {
  daysUntilFirstFollowUp: number;
  daysUntilSecondFollowUp?: number;
  daysUntilThirdFollowUp?: number;
  maxFollowUps: number;
};

export const defaultMessageTemplates: MessageTemplate[] = [
  {
    id: 'initial-high',
    name: 'Contacto Inicial (Alta Intención)',
    subject: 'Sobre tu búsqueda de servicios',
    body: 'Hola {{nombre}},\n\nVi tu publicación sobre tu búsqueda de {{servicio}} y me gustaría saber más sobre tus necesidades específicas.\n\n¿Podríamos agendar una breve llamada para discutir cómo podríamos ayudarte?\n\nSaludos,\n{{nombreRemitente}}',
    type: 'initial'
  },
  {
    id: 'followup-1',
    name: 'Primer Seguimiento',
    subject: 'Seguimiento: Tu búsqueda de servicios',
    body: 'Hola {{nombre}},\n\nEspero que estés bien. Quería hacer un seguimiento sobre mi mensaje anterior acerca de tu búsqueda de {{servicio}}.\n\n¿Has tenido oportunidad de revisarlo? Estaré encantado de resolver cualquier duda que tengas.\n\nSaludos,\n{{nombreRemitente}}',
    type: 'followup'
  },
  {
    id: 'meeting-proposal',
    name: 'Propuesta de Reunión',
    subject: 'Agendemos una reunión',
    body: 'Hola {{nombre}},\n\nGracias por tu respuesta. Me encantaría agendar una reunión para hablar más sobre cómo podemos ayudarte con {{servicio}}.\n\nPuedes elegir un horario que te convenga en mi calendario: {{enlaceCalendario}}\n\nSaludos,\n{{nombreRemitente}}',
    type: 'meeting'
  }
];

/**
 * Personaliza una plantilla de mensaje con los datos del lead
 */
export const personalizeMessage = (template: string, lead: Lead, additionalData?: Record<string, string>): string => {
  let personalized = template
    .replace(/\{\{nombre\}\}/g, lead.name.split(' ')[0])
    .replace(/\{\{nombreCompleto\}\}/g, lead.name)
    .replace(/\{\{empresa\}\}/g, lead.company)
    .replace(/\{\{puesto\}\}/g, lead.position);
    
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      personalized = personalized.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
  }
  
  return personalized;
};

/**
 * Simula el envío de un mensaje a un lead
 */
export const sendMessage = async (
  lead: Lead, 
  messageBody: string, 
  subject?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  // En una implementación real, aquí conectaríamos con el servicio de envío de emails
  console.log(`Enviando mensaje a ${lead.name} <${lead.email}>`);
  console.log(`Asunto: ${subject || 'Sin asunto'}`);
  console.log(`Mensaje: ${messageBody.substring(0, 100)}...`);
  
  // Simular un tiempo de envío
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular éxito o fallo aleatorio (90% éxito)
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
  } else {
    return {
      success: false,
      error: 'Error al enviar el mensaje. Por favor, inténtelo de nuevo.'
    };
  }
};

/**
 * Programa seguimientos automáticos basados en la configuración
 */
export const scheduleFollowUps = (
  lead: Lead, 
  schedule: FollowUpSchedule,
  initialMessageId: string
): { scheduledDates: Date[] } => {
  const scheduledDates: Date[] = [];
  const now = new Date();
  
  // Programar seguimientos según la configuración
  if (schedule.daysUntilFirstFollowUp > 0 && schedule.maxFollowUps >= 1) {
    const firstFollowUp = new Date(now);
    firstFollowUp.setDate(now.getDate() + schedule.daysUntilFirstFollowUp);
    scheduledDates.push(firstFollowUp);
  }
  
  if (schedule.daysUntilSecondFollowUp && schedule.maxFollowUps >= 2) {
    const secondFollowUp = new Date(now);
    secondFollowUp.setDate(now.getDate() + schedule.daysUntilSecondFollowUp);
    scheduledDates.push(secondFollowUp);
  }
  
  if (schedule.daysUntilThirdFollowUp && schedule.maxFollowUps >= 3) {
    const thirdFollowUp = new Date(now);
    thirdFollowUp.setDate(now.getDate() + schedule.daysUntilThirdFollowUp);
    scheduledDates.push(thirdFollowUp);
  }
  
  console.log(`Programados ${scheduledDates.length} seguimientos para ${lead.name}`);
  return { scheduledDates };
};
