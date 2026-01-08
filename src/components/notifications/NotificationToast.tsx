import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Calendar, Sparkles, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';

const notificationIcons: Record<string, React.ReactNode> = {
  scheduled_content: <Calendar className="w-4 h-4" />,
  content_ready: <Sparkles className="w-4 h-4" />,
  trend_alert: <TrendingUp className="w-4 h-4" />,
  approval_request: <MessageSquare className="w-4 h-4" />,
  info: <Bell className="w-4 h-4" />,
  warning: <AlertCircle className="w-4 h-4" />,
};

export const useRealtimeNotifications = () => {
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const notification = payload.new as {
              id: string;
              title: string;
              message: string;
              type: string;
              entity_type: string | null;
              entity_id: string | null;
            };

            // Show toast for new notification
            const icon = notificationIcons[notification.type] || notificationIcons.info;
            
            toast(notification.title, {
              description: notification.message,
              icon,
              duration: 8000,
              action: notification.entity_type === 'content_item' ? {
                label: 'Ver',
                onClick: () => {
                  window.location.href = '/trial/calendar';
                }
              } : undefined
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, []);
};

export const NotificationToast = () => {
  useRealtimeNotifications();
  return null;
};
