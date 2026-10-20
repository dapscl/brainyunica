CREATE TABLE IF NOT EXISTS public.content_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  platform TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates in their organization" ON public.content_templates FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can create templates in their organization" ON public.content_templates FOR INSERT
  WITH CHECK (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid() AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text])) AND created_by = auth.uid());
CREATE POLICY "Admins and moderators can update templates" ON public.content_templates FOR UPDATE
  USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid() AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text])));
CREATE POLICY "Admins and moderators can delete templates" ON public.content_templates FOR DELETE
  USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid() AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text])));

CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON public.content_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER audit_content_templates AFTER INSERT OR UPDATE OR DELETE ON public.content_templates FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE INDEX idx_content_templates_organization ON public.content_templates(organization_id);
CREATE INDEX idx_content_templates_category ON public.content_templates(category);
CREATE INDEX idx_content_templates_tags ON public.content_templates USING GIN(tags);

-- Organizations policies
DROP POLICY IF EXISTS "Admins can manage their organization" ON public.organizations;
CREATE POLICY "Users can create their own organization" ON public.organizations FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can manage their organization" ON public.organizations FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their organization" ON public.organizations FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Brands policies
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;
CREATE POLICY "Organization members can create brands" ON public.brands FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = brands.organization_id AND om.user_id = auth.uid() AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'editor'::text])));
CREATE POLICY "Organization members can update brands" ON public.brands FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = brands.organization_id AND om.user_id = auth.uid() AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'editor'::text])));
CREATE POLICY "Organization admins can delete brands" ON public.brands FOR DELETE
USING (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = brands.organization_id AND om.user_id = auth.uid() AND om.role = ANY (ARRAY['owner'::text, 'admin'::text])));

-- Function hardening
CREATE OR REPLACE FUNCTION public.is_organization_member(_org_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE organization_id = _org_id AND user_id = _user_id)
      OR EXISTS (SELECT 1 FROM public.organizations WHERE id = _org_id AND owner_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- Ad spend
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
CREATE INDEX idx_ad_spend_logs_org_date ON public.ad_spend_logs(organization_id, date DESC);
CREATE INDEX idx_ad_spend_logs_channel ON public.ad_spend_logs(channel);
CREATE INDEX idx_ad_spend_logs_campaign ON public.ad_spend_logs(campaign_id);
ALTER TABLE public.ad_spend_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view ad spend logs" ON public.ad_spend_logs FOR SELECT
USING (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = ad_spend_logs.organization_id AND om.user_id = auth.uid()));
CREATE POLICY "Organization editors can insert ad spend logs" ON public.ad_spend_logs FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = ad_spend_logs.organization_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin', 'editor')));
CREATE POLICY "Organization editors can update ad spend logs" ON public.ad_spend_logs FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = ad_spend_logs.organization_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin', 'editor')));
CREATE POLICY "Organization admins can delete ad spend logs" ON public.ad_spend_logs FOR DELETE
USING (EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = ad_spend_logs.organization_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin')));

CREATE TRIGGER update_ad_spend_logs_updated_at BEFORE UPDATE ON public.ad_spend_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_ad_spend_metrics(_organization_id UUID, _start_date DATE DEFAULT NULL, _end_date DATE DEFAULT NULL)
RETURNS TABLE (total_spend NUMERIC, channel_breakdown JSONB, daily_spend JSONB, campaign_performance JSONB)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.organization_members om WHERE om.organization_id = _organization_id AND om.user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Access denied to organization';
  END IF;
  _start_date := COALESCE(_start_date, CURRENT_DATE - INTERVAL '30 days');
  _end_date := COALESCE(_end_date, CURRENT_DATE);
  RETURN QUERY
  WITH spend_data AS (
    SELECT SUM(amount) as total, channel, date, campaign_id, campaign_name
    FROM public.ad_spend_logs
    WHERE organization_id = _organization_id AND date BETWEEN _start_date AND _end_date
    GROUP BY channel, date, campaign_id, campaign_name
  )
  SELECT
    (SELECT COALESCE(SUM(amount), 0) FROM public.ad_spend_logs WHERE organization_id = _organization_id AND date BETWEEN _start_date AND _end_date),
    (SELECT COALESCE(jsonb_object_agg(channel, channel_total), '{}'::jsonb) FROM (SELECT channel, SUM(total) as channel_total FROM spend_data GROUP BY channel) channel_data),
    (SELECT COALESCE(jsonb_object_agg(date::text, daily_total), '{}'::jsonb) FROM (SELECT date, SUM(total) as daily_total FROM spend_data GROUP BY date ORDER BY date) daily_data),
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('campaign_id', campaign_id, 'campaign_name', campaign_name, 'total_spend', campaign_total, 'channel', channel)), '[]'::jsonb)
     FROM (SELECT campaign_id, campaign_name, channel, SUM(total) as campaign_total FROM spend_data WHERE campaign_id IS NOT NULL GROUP BY campaign_id, campaign_name, channel ORDER BY campaign_total DESC) campaign_data);
END;
$$;