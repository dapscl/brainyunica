-- Fix send_notification to validate caller permissions
CREATE OR REPLACE FUNCTION public.send_notification(
  p_user_id uuid, 
  p_title text, 
  p_message text, 
  p_type text DEFAULT 'info'::text, 
  p_entity_type text DEFAULT NULL::text, 
  p_entity_id uuid DEFAULT NULL::uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_id uuid;
BEGIN
  -- Get the caller's ID
  v_caller_id := auth.uid();
  
  -- Validate caller is authenticated
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to send notifications';
  END IF;
  
  -- Allow users to send notifications to themselves
  -- OR allow if caller is in the same organization as the target user
  IF v_caller_id != p_user_id THEN
    -- Check if caller shares an organization with target user
    IF NOT EXISTS (
      SELECT 1 
      FROM public.organization_members om1
      JOIN public.organization_members om2 ON om1.organization_id = om2.organization_id
      WHERE om1.user_id = v_caller_id 
        AND om2.user_id = p_user_id
    ) AND NOT EXISTS (
      -- Also check if caller is organization owner
      SELECT 1 
      FROM public.organizations o
      JOIN public.organization_members om ON o.id = om.organization_id
      WHERE o.owner_id = v_caller_id 
        AND om.user_id = p_user_id
    ) AND NOT public.has_role(v_caller_id, 'admin') THEN
      RAISE EXCEPTION 'You do not have permission to send notifications to this user';
    END IF;
  END IF;
  
  INSERT INTO public.notifications (user_id, title, message, type, entity_type, entity_id)
  VALUES (p_user_id, p_title, p_message, p_type, p_entity_type, p_entity_id);
END;
$function$;

-- Add foreign key constraint to content_approvals_legacy for reviewer validation
DO $$
BEGIN
  -- Check if constraint doesn't exist before adding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'content_approvals_legacy_reviewer_fk' 
    AND table_name = 'content_approvals_legacy'
  ) THEN
    ALTER TABLE public.content_approvals_legacy
    ADD CONSTRAINT content_approvals_legacy_reviewer_fk 
    FOREIGN KEY (reviewer_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create validation function for approval reviewers
CREATE OR REPLACE FUNCTION public.validate_approval_reviewer()
RETURNS TRIGGER AS $$
DECLARE
  v_content_org_id UUID;
BEGIN
  -- Get the organization ID for the content
  SELECT b.organization_id INTO v_content_org_id
  FROM public.content_items ci
  JOIN public.projects p ON ci.project_id = p.id
  JOIN public.brands b ON p.brand_id = b.id
  WHERE ci.id = NEW.content_id;

  -- Validate reviewer is a member of the content's organization
  IF NOT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = NEW.reviewer_id
      AND organization_id = v_content_org_id
  ) AND NOT EXISTS (
    SELECT 1 FROM public.organizations
    WHERE id = v_content_org_id
      AND owner_id = NEW.reviewer_id
  ) THEN
    RAISE EXCEPTION 'Reviewer must be a member of the content organization';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for content_approvals_legacy
DROP TRIGGER IF EXISTS validate_reviewer_trigger ON public.content_approvals_legacy;
CREATE TRIGGER validate_reviewer_trigger
  BEFORE INSERT OR UPDATE ON public.content_approvals_legacy
  FOR EACH ROW EXECUTE FUNCTION public.validate_approval_reviewer();