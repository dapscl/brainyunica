-- Enable UPDATE and DELETE for projects table with proper RLS policies

-- Drop existing restrictive policies that prevent updates and deletes
DROP POLICY IF EXISTS "Organization members can create projects" ON public.projects;
DROP POLICY IF EXISTS "Organization members can view projects" ON public.projects;

-- Recreate policies with full CRUD support

-- SELECT: Organization members can view projects
CREATE POLICY "Organization members can view projects"
ON public.projects
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM brands b
    JOIN organization_members om ON b.organization_id = om.organization_id
    WHERE b.id = projects.brand_id
    AND om.user_id = auth.uid()
  )
);

-- INSERT: Organization members can create projects
CREATE POLICY "Organization members can create projects"
ON public.projects
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM brands b
    JOIN organization_members om ON b.organization_id = om.organization_id
    WHERE b.id = projects.brand_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'editor')
  )
);

-- UPDATE: Organization editors and above can update projects
CREATE POLICY "Organization editors can update projects"
ON public.projects
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM brands b
    JOIN organization_members om ON b.organization_id = om.organization_id
    WHERE b.id = projects.brand_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'editor')
  )
);

-- DELETE: Organization admins and above can delete projects
CREATE POLICY "Organization admins can delete projects"
ON public.projects
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM brands b
    JOIN organization_members om ON b.organization_id = om.organization_id
    WHERE b.id = projects.brand_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- Add audit triggers for projects table
DROP TRIGGER IF EXISTS audit_projects_trigger ON public.projects;
CREATE TRIGGER audit_projects_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();