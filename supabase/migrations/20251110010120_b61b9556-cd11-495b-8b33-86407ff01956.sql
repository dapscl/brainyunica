-- Create content_items table
CREATE TABLE public.content_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb,
  content_type text NOT NULL DEFAULT 'post',
  status text NOT NULL DEFAULT 'draft',
  scheduled_date timestamp with time zone,
  published_date timestamp with time zone,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  parent_version_id uuid REFERENCES public.content_items(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_content_items_project ON public.content_items(project_id);
CREATE INDEX idx_content_items_brand ON public.content_items(brand_id);
CREATE INDEX idx_content_items_status ON public.content_items(status);
CREATE INDEX idx_content_items_scheduled ON public.content_items(scheduled_date);
CREATE INDEX idx_content_items_tags ON public.content_items USING GIN(tags);

-- Enable RLS
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Organization members can view content"
ON public.content_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.brands b ON p.brand_id = b.id
    JOIN public.organization_members om ON b.organization_id = om.organization_id
    WHERE p.id = content_items.project_id
    AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Organization editors can create content"
ON public.content_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.brands b ON p.brand_id = b.id
    JOIN public.organization_members om ON b.organization_id = om.organization_id
    WHERE p.id = content_items.project_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "Organization editors can update content"
ON public.content_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.brands b ON p.brand_id = b.id
    JOIN public.organization_members om ON b.organization_id = om.organization_id
    WHERE p.id = content_items.project_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "Organization admins can delete content"
ON public.content_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.brands b ON p.brand_id = b.id
    JOIN public.organization_members om ON b.organization_id = om.organization_id
    WHERE p.id = content_items.project_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- Create content_approvals table
CREATE TABLE public.content_approvals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  comments text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_approvals_content ON public.content_approvals(content_id);

ALTER TABLE public.content_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view approvals"
ON public.content_approvals
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.content_items ci
    JOIN public.projects p ON ci.project_id = p.id
    JOIN public.brands b ON p.brand_id = b.id
    JOIN public.organization_members om ON b.organization_id = om.organization_id
    WHERE ci.id = content_approvals.content_id
    AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Reviewers can update approvals"
ON public.content_approvals
FOR UPDATE
USING (auth.uid() = reviewer_id);

-- Update brand_kits table with advanced features
ALTER TABLE public.brand_kits
ADD COLUMN IF NOT EXISTS color_palette jsonb DEFAULT '{"primary": [], "secondary": [], "accent": []}'::jsonb,
ADD COLUMN IF NOT EXISTS typography jsonb DEFAULT '{"primary": {}, "secondary": {}}'::jsonb,
ADD COLUMN IF NOT EXISTS spacing_scale jsonb DEFAULT '{"xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32}'::jsonb,
ADD COLUMN IF NOT EXISTS logo_variations jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS brand_guidelines text,
ADD COLUMN IF NOT EXISTS dos_and_donts jsonb DEFAULT '{"dos": [], "donts": []}'::jsonb;

-- Create trigger for content_items updated_at
CREATE TRIGGER update_content_items_updated_at
BEFORE UPDATE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_approvals_updated_at
BEFORE UPDATE ON public.content_approvals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger to audit content changes
CREATE TRIGGER audit_content_items_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
