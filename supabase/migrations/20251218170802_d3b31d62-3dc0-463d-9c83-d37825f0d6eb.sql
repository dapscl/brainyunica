-- Table for trial brand profiles
CREATE TABLE public.trial_brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  brand_handle TEXT,
  brand_type TEXT DEFAULT 'instagram',
  tone TEXT DEFAULT 'profesional',
  style TEXT DEFAULT 'moderno',
  colors JSONB DEFAULT '[]'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  personality TEXT,
  analysis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Table for tracking content generation activity
CREATE TABLE public.trial_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'copy_generated', 'ideas_generated', 'variants_generated', 'improved', 'translated'
  content_preview TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trial_brand_profiles
CREATE POLICY "Users can view their own brand profile"
ON public.trial_brand_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand profile"
ON public.trial_brand_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand profile"
ON public.trial_brand_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for trial_activity_logs
CREATE POLICY "Users can view their own activity"
ON public.trial_activity_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.trial_activity_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_trial_brand_profiles_updated_at
BEFORE UPDATE ON public.trial_brand_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();