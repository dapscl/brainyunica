-- Actualizar política de INSERT en content_templates para incluir owner
DROP POLICY IF EXISTS "Users can create templates in their organization" ON public.content_templates;

CREATE POLICY "Users can create templates in their organization"
ON public.content_templates
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text])
  )
  AND created_by = auth.uid()
);

-- Actualizar política de UPDATE para incluir owner
DROP POLICY IF EXISTS "Admins and moderators can update templates" ON public.content_templates;

CREATE POLICY "Admins and moderators can update templates"
ON public.content_templates
FOR UPDATE
USING (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text])
  )
);

-- Actualizar política de DELETE para incluir owner
DROP POLICY IF EXISTS "Admins and moderators can delete templates" ON public.content_templates;

CREATE POLICY "Admins and moderators can delete templates"
ON public.content_templates
FOR DELETE
USING (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_members om
    WHERE om.user_id = auth.uid()
      AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text])
  )
);