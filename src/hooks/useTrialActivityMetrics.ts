import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityMetrics {
  totalContents: number;
  copiesGenerated: number;
  ideasGenerated: number;
  variantsGenerated: number;
  improvements: number;
  translations: number;
  todayActivity: number;
  weekActivity: number;
}

export const useTrialActivityMetrics = () => {
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    totalContents: 0,
    copiesGenerated: 0,
    ideasGenerated: 0,
    variantsGenerated: 0,
    improvements: 0,
    translations: 0,
    todayActivity: 0,
    weekActivity: 0
  });
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get all activity logs
      const { data: logs, error } = await supabase
        .from('trial_activity_logs')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading activity metrics:', error);
        setLoading(false);
        return;
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const activityLogs = logs || [];
      
      const newMetrics: ActivityMetrics = {
        totalContents: activityLogs.length,
        copiesGenerated: activityLogs.filter(l => l.activity_type === 'copy_generated').length,
        ideasGenerated: activityLogs.filter(l => l.activity_type === 'ideas_generated').length,
        variantsGenerated: activityLogs.filter(l => l.activity_type === 'variants_generated').length,
        improvements: activityLogs.filter(l => l.activity_type === 'improved').length,
        translations: activityLogs.filter(l => l.activity_type === 'translated').length,
        todayActivity: activityLogs.filter(l => new Date(l.created_at) >= today).length,
        weekActivity: activityLogs.filter(l => new Date(l.created_at) >= weekAgo).length
      };

      setMetrics(newMetrics);
    } catch (error) {
      console.error('Error in loadMetrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (activityType: string, contentPreview?: string, metadata?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('trial_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          content_preview: contentPreview?.substring(0, 200),
          metadata: metadata || {}
        });

      if (error) {
        console.error('Error logging activity:', error);
        return;
      }

      // Refresh metrics
      loadMetrics();
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return { metrics, loading, logActivity, refreshMetrics: loadMetrics };
};
