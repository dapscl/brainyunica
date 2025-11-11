import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdSpendLog {
  id: string;
  organization_id: string;
  channel: string;
  amount: number;
  date: string;
  campaign_id: string | null;
  campaign_name: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AdSpendMetrics {
  total_spend: number;
  channel_breakdown: Record<string, number>;
  daily_spend: Record<string, number>;
  campaign_performance: Array<{
    campaign_id: string;
    campaign_name: string;
    total_spend: number;
    channel: string;
  }>;
}

export function useAdSpendLogs(organizationId: string | undefined, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['ad-spend-logs', organizationId, startDate, endDate],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from('ad_spend_logs')
        .select('*')
        .eq('organization_id', organizationId)
        .order('date', { ascending: false });

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ad spend logs:', error);
        throw error;
      }

      return data as AdSpendLog[];
    },
    enabled: !!organizationId,
  });
}

export function useAdSpendMetrics(organizationId: string | undefined, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['ad-spend-metrics', organizationId, startDate, endDate],
    queryFn: async () => {
      if (!organizationId) return null;

      const { data, error } = await supabase.rpc('get_ad_spend_metrics', {
        _organization_id: organizationId,
        _start_date: startDate || null,
        _end_date: endDate || null,
      });

      if (error) {
        console.error('Error fetching ad spend metrics:', error);
        throw error;
      }

      // Parse the metrics data
      const metrics = data && data.length > 0 ? data[0] : null;
      
      return metrics as AdSpendMetrics | null;
    },
    enabled: !!organizationId,
  });
}

export function useAddAdSpend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: Omit<AdSpendLog, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ad_spend_logs')
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ad-spend-logs', variables.organization_id] });
      queryClient.invalidateQueries({ queryKey: ['ad-spend-metrics', variables.organization_id] });
      toast.success('Ad spend log agregado exitosamente');
    },
    onError: (error) => {
      console.error('Error adding ad spend log:', error);
      toast.error('Error al agregar ad spend log');
    },
  });
}

export function useBulkAddAdSpend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logs: Array<Omit<AdSpendLog, 'id' | 'created_at' | 'updated_at'>>) => {
      const { data, error } = await supabase
        .from('ad_spend_logs')
        .insert(logs)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      if (variables.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['ad-spend-logs', variables[0].organization_id] });
        queryClient.invalidateQueries({ queryKey: ['ad-spend-metrics', variables[0].organization_id] });
      }
      toast.success(`${data.length} ad spend logs agregados exitosamente`);
    },
    onError: (error) => {
      console.error('Error adding bulk ad spend logs:', error);
      toast.error('Error al agregar ad spend logs');
    },
  });
}
