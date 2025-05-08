
/**
 * Servicio para la gestión de calendario y agendamiento
 */

import { Lead } from '@/components/LeadCard';

export type MeetingType = 'discovery' | 'demo' | 'proposal' | 'followup';

export type AvailableSlot = {
  start: Date;
  end: Date;
  available: boolean;
};

export type CalendarProvider = 'calendly' | 'google' | 'microsoft' | 'manual';

export type CalendarSettings = {
  provider: CalendarProvider;
  calendarUrl?: string;
  calendarId?: string;
  meetingDuration: number; // en minutos
  bufferTime: number; // en minutos
  workingHours: {
    start: string; // formato '09:00'
    end: string; // formato '17:00'
  };
  workingDays: number[]; // 0 = domingo, 1 = lunes, ..., 6 = sábado
};

const defaultSettings: CalendarSettings = {
  provider: 'calendly',
  meetingDuration: 30,
  bufferTime: 15,
  workingHours: {
    start: '09:00',
    end: '17:00'
  },
  workingDays: [1, 2, 3, 4, 5] // Lunes a viernes
};

/**
 * Genera un enlace para agendar una reunión
 */
export const generateMeetingLink = (
  lead: Lead, 
  settings: CalendarSettings = defaultSettings,
  meetingType: MeetingType = 'discovery'
): string => {
  // En una implementación real, conectaríamos con la API del proveedor
  
  switch (settings.provider) {
    case 'calendly':
      if (!settings.calendarUrl) {
        return '#error-no-calendar-url';
      }
      // Para Calendly, agregamos parámetros UTM y prefill
      return `${settings.calendarUrl}?name=${encodeURIComponent(lead.name)}&email=${encodeURIComponent(lead.email || '')}&utm_source=crm&utm_medium=prospecting&utm_campaign=lead_${lead.id}`;
      
    case 'google':
      // Para Google Calendar, generamos un enlace de evento prefilled
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Reunión con ${lead.name} de ${lead.company}`)}&details=${encodeURIComponent(`Conversación sobre necesidades de ${lead.company}`)}`;
      
    case 'microsoft':
      // Para Outlook/Microsoft, generamos un enlace similar
      return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(`Reunión con ${lead.name} de ${lead.company}`)}`;
      
    case 'manual':
    default:
      // Para manual, sólo devolvemos un placeholder
      return '#manual-scheduling';
  }
};

/**
 * Simula obtener slots disponibles para un rango de fechas
 */
export const getAvailableSlots = async (
  startDate: Date, 
  endDate: Date, 
  settings: CalendarSettings = defaultSettings
): Promise<AvailableSlot[]> => {
  const slots: AvailableSlot[] = [];
  
  // En una implementación real, consultaríamos la API del proveedor de calendario
  
  // Simulamos slots para cada día hábil en el rango
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Si es un día hábil según la configuración
    if (settings.workingDays.includes(dayOfWeek)) {
      // Obtener horas de inicio y fin
      const [startHour, startMinute] = settings.workingHours.start.split(':').map(Number);
      const [endHour, endMinute] = settings.workingHours.end.split(':').map(Number);
      
      // Crear slots a lo largo del día
      let slotStart = new Date(currentDate);
      slotStart.setHours(startHour, startMinute, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(endHour, endMinute, 0, 0);
      
      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotStart.getMinutes() + settings.meetingDuration);
        
        if (slotEnd <= dayEnd) {
          // Simular disponibilidad (70% de slots disponibles)
          const available = Math.random() > 0.3;
          
          slots.push({
            start: new Date(slotStart),
            end: new Date(slotEnd),
            available
          });
        }
        
        // Avanzar al siguiente slot (duración + buffer)
        slotStart.setMinutes(slotStart.getMinutes() + settings.meetingDuration + settings.bufferTime);
      }
    }
    
    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots;
};
