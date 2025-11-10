-- Create content templates table
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

-- Enable RLS
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_templates
CREATE POLICY "Users can view templates in their organization"
  ON public.content_templates
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create templates in their organization"
  ON public.content_templates
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_members om
      WHERE om.user_id = auth.uid()
      AND om.role IN ('admin', 'moderator')
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Admins and moderators can update templates"
  ON public.content_templates
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_members om
      WHERE om.user_id = auth.uid()
      AND om.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins and moderators can delete templates"
  ON public.content_templates
  FOR DELETE
  USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_members om
      WHERE om.user_id = auth.uid()
      AND om.role IN ('admin', 'moderator')
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_content_templates_updated_at
  BEFORE UPDATE ON public.content_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit trigger
CREATE TRIGGER audit_content_templates
  AFTER INSERT OR UPDATE OR DELETE ON public.content_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Add index for better performance
CREATE INDEX idx_content_templates_organization ON public.content_templates(organization_id);
CREATE INDEX idx_content_templates_category ON public.content_templates(category);
CREATE INDEX idx_content_templates_tags ON public.content_templates USING GIN(tags);