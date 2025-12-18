-- Add trial support to organizations
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial';

-- Add brand learning fields to brand_kits
ALTER TABLE public.brand_kits
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS instagram_data JSONB,
ADD COLUMN IF NOT EXISTS voice_profile JSONB,
ADD COLUMN IF NOT EXISTS learned_keywords TEXT[],
ADD COLUMN IF NOT EXISTS content_themes TEXT[],
ADD COLUMN IF NOT EXISTS posting_patterns JSONB;

-- Create index for trial management
CREATE INDEX IF NOT EXISTS idx_organizations_trial_ends_at ON public.organizations(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status ON public.organizations(subscription_status);

-- Function to set trial on new organization
CREATE OR REPLACE FUNCTION public.set_organization_trial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.trial_ends_at := NOW() + INTERVAL '45 days';
  NEW.subscription_status := 'trial';
  RETURN NEW;
END;
$$;

-- Trigger to auto-set trial for new organizations
DROP TRIGGER IF EXISTS set_trial_on_organization_insert ON public.organizations;
CREATE TRIGGER set_trial_on_organization_insert
  BEFORE INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_trial();