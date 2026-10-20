-- Enhance content_approvals in place (equivalent to the original approval workflow migration)
ALTER TABLE public.content_approvals ADD COLUMN IF NOT EXISTS assigned_by UUID;
ALTER TABLE public.content_approvals ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.content_approvals ADD CONSTRAINT content_approvals_status_check CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'changes_requested'));

CREATE INDEX IF NOT EXISTS idx_content_approvals_reviewer_id ON public.content_approvals(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_content_approvals_status ON public.content_approvals(status);

DROP POLICY IF EXISTS "Reviewers can update approvals" ON public.content_approvals;

CREATE POLICY "Organization editors can create approvals"
ON public.content_approvals FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM content_items ci JOIN projects p ON ci.project_id = p.id JOIN brands b ON p.brand_id = b.id JOIN organization_members om ON b.organization_id = om.organization_id WHERE ci.id = content_approvals.content_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin', 'editor')));

CREATE POLICY "Reviewers can update their approvals"
ON public.content_approvals FOR UPDATE
USING (auth.uid() = reviewer_id OR auth.uid() = assigned_by);

CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'other')),
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  tags TEXT[],
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_library_org_id ON public.media_library(organization_id);
CREATE INDEX idx_media_library_file_type ON public.media_library(file_type);
CREATE INDEX idx_media_library_tags ON public.media_library USING GIN(tags);
CREATE INDEX idx_media_library_category ON public.media_library(category);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view media"
ON public.media_library FOR SELECT
USING (EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = media_library.organization_id AND om.user_id = auth.uid()));

CREATE POLICY "Organization members can upload media"
ON public.media_library FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = media_library.organization_id AND om.user_id = auth.uid()));

CREATE POLICY "Organization editors can update media"
ON public.media_library FOR UPDATE
USING (EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = media_library.organization_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin', 'editor')));

CREATE POLICY "Organization admins can delete media"
ON public.media_library FOR DELETE
USING (EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = media_library.organization_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin')));

CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON public.media_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER audit_content_approvals_trigger AFTER INSERT OR UPDATE OR DELETE ON public.content_approvals FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_media_library_trigger AFTER INSERT OR UPDATE OR DELETE ON public.media_library FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE POLICY "Organization members can view media files" ON storage.objects FOR SELECT USING (bucket_id = 'media-library');
CREATE POLICY "Authenticated users can upload media files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media-library' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their uploaded files" ON storage.objects FOR UPDATE USING (bucket_id = 'media-library' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their uploaded files" ON storage.objects FOR DELETE USING (bucket_id = 'media-library' AND auth.role() = 'authenticated');