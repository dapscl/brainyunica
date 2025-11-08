-- Create SECURITY DEFINER functions to break RLS recursion
-- These functions bypass RLS when checking organization membership

-- Function to check if a user is a member of an organization
CREATE OR REPLACE FUNCTION public.is_organization_member(
  _org_id uuid,
  _user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = _org_id
      AND user_id = _user_id
  )
$$;

-- Function to check if a user is the owner of an organization
CREATE OR REPLACE FUNCTION public.is_organization_owner(
  _org_id uuid,
  _user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organizations
    WHERE id = _org_id
      AND owner_id = _user_id
  )
$$;

-- Drop old policies that cause recursion
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Admins can manage organization members" ON public.organization_members;

-- Create new policies using SECURITY DEFINER functions (no recursion)
CREATE POLICY "Users can view organizations they belong to"
ON public.organizations
FOR SELECT
TO authenticated
USING (public.is_organization_member(id, auth.uid()));

CREATE POLICY "Admins can manage organization members"
ON public.organization_members
FOR ALL
TO authenticated
USING (public.is_organization_owner(organization_id, auth.uid()))
WITH CHECK (public.is_organization_owner(organization_id, auth.uid()));