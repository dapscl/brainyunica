-- Add logo_url and description columns to trial_brand_profiles
ALTER TABLE public.trial_brand_profiles 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS connected_ads JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS connected_social JSONB DEFAULT '[]'::jsonb;