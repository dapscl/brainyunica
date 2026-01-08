import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar, Clock } from 'lucide-react';

interface ScheduledContent {
  id: string;
  title: string;
  scheduled_date: string;
  brand_id: string;
}

export const useScheduledContentNotifier = () => {
  const notifiedIds = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkScheduledContent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get content scheduled for the next 30 minutes
        const now = new Date();
        const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

        const { data: scheduledContent, error } = await supabase
          .from('content_items')
          .select('id, title, scheduled_date, brand_id')
          .eq('status', 'scheduled')
          .gte('scheduled_date', now.toISOString())
          .lte('scheduled_date', thirtyMinutesFromNow.toISOString())
          .order('scheduled_date', { ascending: true });

        if (error) {
          console.error('Error checking scheduled content:', error);
          return;
        }

        if (scheduledContent && scheduledContent.length > 0) {
          scheduledContent.forEach((content: ScheduledContent) => {
            if (!notifiedIds.current.has(content.id)) {
              notifiedIds.current.add(content.id);
              
              const scheduledDate = new Date(content.scheduled_date);
              const minutesUntil = Math.round((scheduledDate.getTime() - now.getTime()) / 60000);
              
              // Show toast notification
              toast.info(
                `"${content.title}" se publicará en ${minutesUntil} minutos`,
                {
                  icon: <Clock className="w-4 h-4" />,
                  duration: 10000,
                  action: {
                    label: 'Ver',
                    onClick: () => {
                      window.location.href = '/trial/calendar';
                    }
                  }
                }
              );

              // Also create a database notification
              supabase.rpc('send_notification', {
                p_user_id: user.id,
                p_title: 'Contenido próximo a publicarse',
                p_message: `"${content.title}" está programado para publicarse en ${minutesUntil} minutos`,
                p_type: 'scheduled_content',
                p_entity_type: 'content_item',
                p_entity_id: content.id
              }).then(({ error }) => {
                if (error) console.error('Error sending notification:', error);
              });
            }
          });
        }
      } catch (error) {
        console.error('Error in scheduled content notifier:', error);
      }
    };

    // Check immediately on mount
    checkScheduledContent();

    // Check every 5 minutes
    intervalRef.current = setInterval(checkScheduledContent, 5 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};

export const ScheduledContentNotifier = () => {
  useScheduledContentNotifier();
  return null;
};
