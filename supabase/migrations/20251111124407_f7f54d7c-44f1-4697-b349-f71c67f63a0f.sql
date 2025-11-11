-- Create ad_spend_logs table for tracking advertising spend
CREATE TABLE public.ad_spend_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  campaign_id TEXT,
  campaign_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_ad_spend_logs_org_date ON public.ad_spend_logs(organization_id, date DESC);
CREATE INDEX idx_ad_spend_logs_channel ON public.ad_spend_logs(channel);
CREATE INDEX idx_ad_spend_logs_campaign ON public.ad_spend_logs(campaign_id);

-- Enable Row Level Security
ALTER TABLE public.ad_spend_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ad_spend_logs

-- Organization members can view their organization's ad spend logs
CREATE POLICY "Organization members can view ad spend logs"
ON public.ad_spend_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = ad_spend_logs.organization_id
      AND om.user_id = auth.uid()
  )
);

-- Organization editors can insert ad spend logs
CREATE POLICY "Organization editors can insert ad spend logs"
ON public.ad_spend_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = ad_spend_logs.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin', 'editor')
  )
);

-- Organization editors can update ad spend logs
CREATE POLICY "Organization editors can update ad spend logs"
ON public.ad_spend_logs
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = ad_spend_logs.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin', 'editor')
  )
);

-- Organization admins can delete ad spend logs
CREATE POLICY "Organization admins can delete ad spend logs"
ON public.ad_spend_logs
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = ad_spend_logs.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
  )
);

-- Create trigger for automatic updated_at timestamps
CREATE TRIGGER update_ad_spend_logs_updated_at
BEFORE UPDATE ON public.ad_spend_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get ad spend metrics for an organization
CREATE OR REPLACE FUNCTION public.get_ad_spend_metrics(
  _organization_id UUID,
  _start_date DATE DEFAULT NULL,
  _end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  total_spend NUMERIC,
  channel_breakdown JSONB,
  daily_spend JSONB,
  campaign_performance JSONB
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user has access to organization
  IF NOT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = _organization_id
      AND om.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied to organization';
  END IF;

  -- Set default dates if not provided
  _start_date := COALESCE(_start_date, CURRENT_DATE - INTERVAL '30 days');
  _end_date := COALESCE(_end_date, CURRENT_DATE);

  RETURN QUERY
  WITH spend_data AS (
    SELECT
      SUM(amount) as total,
      channel,
      date,
      campaign_id,
      campaign_name
    FROM public.ad_spend_logs
    WHERE organization_id = _organization_id
      AND date BETWEEN _start_date AND _end_date
    GROUP BY channel, date, campaign_id, campaign_name
  )
  SELECT
    -- Total spend
    (SELECT COALESCE(SUM(amount), 0) 
     FROM public.ad_spend_logs 
     WHERE organization_id = _organization_id 
       AND date BETWEEN _start_date AND _end_date) as total_spend,
    
    -- Channel breakdown
    (SELECT COALESCE(jsonb_object_agg(channel, channel_total), '{}'::jsonb)
     FROM (
       SELECT channel, SUM(total) as channel_total
       FROM spend_data
       GROUP BY channel
     ) channel_data) as channel_breakdown,
    
    -- Daily spend
    (SELECT COALESCE(jsonb_object_agg(date::text, daily_total), '{}'::jsonb)
     FROM (
       SELECT date, SUM(total) as daily_total
       FROM spend_data
       GROUP BY date
       ORDER BY date
     ) daily_data) as daily_spend,
    
    -- Campaign performance
    (SELECT COALESCE(jsonb_agg(
       jsonb_build_object(
         'campaign_id', campaign_id,
         'campaign_name', campaign_name,
         'total_spend', campaign_total,
         'channel', channel
       )
     ), '[]'::jsonb)
     FROM (
       SELECT 
         campaign_id,
         campaign_name,
         channel,
         SUM(total) as campaign_total
       FROM spend_data
       WHERE campaign_id IS NOT NULL
       GROUP BY campaign_id, campaign_name, channel
       ORDER BY campaign_total DESC
     ) campaign_data) as campaign_performance;
END;
$$;