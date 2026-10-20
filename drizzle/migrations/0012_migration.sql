CREATE OR REPLACE FUNCTION public.send_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'info'::text, p_entity_type text DEFAULT NULL::text, p_entity_id uuid DEFAULT NULL::uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_id uuid;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to send notifications';
  END IF;
  IF v_caller_id != p_user_id THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.organization_members om1
      JOIN public.organization_members om2 ON om1.organization_id = om2.organization_id
      WHERE om1.user_id = v_caller_id AND om2.user_id = p_user_id
    ) AND NOT EXISTS (
      SELECT 1 FROM public.organizations o
      JOIN public.organization_members om ON o.id = om.organization_id
      WHERE o.owner_id = v_caller_id AND om.user_id = p_user_id
    ) AND NOT public.has_role(v_caller_id, 'admin') THEN
      RAISE EXCEPTION 'You do not have permission to send notifications to this user';
    END IF;
  END IF;
  INSERT INTO public.notifications (user_id, title, message, type, entity_type, entity_id)
  VALUES (p_user_id, p_title, p_message, p_type, p_entity_type, p_entity_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_approval_reviewer()
RETURNS TRIGGER AS $$
DECLARE
  v_content_org_id UUID;
BEGIN
  SELECT b.organization_id INTO v_content_org_id
  FROM public.content_items ci
  JOIN public.projects p ON ci.project_id = p.id
  JOIN public.brands b ON p.brand_id = b.id
  WHERE ci.id = NEW.content_id;
  IF NOT EXISTS (SELECT 1 FROM public.organization_members WHERE user_id = NEW.reviewer_id AND organization_id = v_content_org_id)
     AND NOT EXISTS (SELECT 1 FROM public.organizations WHERE id = v_content_org_id AND owner_id = NEW.reviewer_id) THEN
    RAISE EXCEPTION 'Reviewer must be a member of the content organization';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER validate_reviewer_trigger BEFORE INSERT OR UPDATE ON public.content_approvals FOR EACH ROW EXECUTE FUNCTION public.validate_approval_reviewer();

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can manage all leads" ON public.leads;
CREATE POLICY "Admins can view all leads" ON public.leads FOR SELECT USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.trial_brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  brand_name TEXT NOT NULL,
  brand_handle TEXT,
  brand_type TEXT DEFAULT 'instagram',
  tone TEXT DEFAULT 'profesional',
  style TEXT DEFAULT 'moderno',
  colors JSONB DEFAULT '[]'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  personality TEXT,
  analysis JSONB DEFAULT '{}'::jsonb,
  logo_url TEXT,
  description TEXT,
  connected_ads JSONB DEFAULT '[]'::jsonb,
  connected_social JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);
CREATE TABLE public.trial_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  content_preview TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.trial_brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own brand profile" ON public.trial_brand_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own brand profile" ON public.trial_brand_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brand profile" ON public.trial_brand_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own activity" ON public.trial_activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activity" ON public.trial_activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_trial_brand_profiles_updated_at BEFORE UPDATE ON public.trial_brand_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.export_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  title TEXT,
  brand_name TEXT,
  hashtags TEXT[],
  format TEXT NOT NULL,
  exported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own export history" ON public.export_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own export history" ON public.export_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own export history" ON public.export_history FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_export_history_user_id ON public.export_history(user_id);
CREATE INDEX idx_export_history_exported_at ON public.export_history(exported_at DESC);

-- Data API access for all app tables
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.user_roles, public.profiles, public.organizations, public.organization_members, public.brands, public.brand_kits,
  public.plans, public.subscriptions, public.projects, public.audit_logs, public.notifications, public.content_items,
  public.content_approvals, public.media_library, public.content_templates, public.ad_spend_logs,
  public.whatsapp_conversations, public.whatsapp_messages, public.content_suggestions, public.trend_tracking,
  public.leads, public.trial_brand_profiles, public.trial_activity_logs, public.export_history
TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON public.plans TO anon;
GRANT INSERT ON public.leads TO anon;