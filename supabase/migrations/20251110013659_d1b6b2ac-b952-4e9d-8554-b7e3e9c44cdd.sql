-- Add audit triggers for all tables that don't have them yet

-- Add audit trigger for organizations
DROP TRIGGER IF EXISTS audit_organizations_trigger ON public.organizations;
CREATE TRIGGER audit_organizations_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Add audit trigger for brands
DROP TRIGGER IF EXISTS audit_brands_trigger ON public.brands;
CREATE TRIGGER audit_brands_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Add audit trigger for organization_members
DROP TRIGGER IF EXISTS audit_organization_members_trigger ON public.organization_members;
CREATE TRIGGER audit_organization_members_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.organization_members
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Add audit trigger for brand_kits
DROP TRIGGER IF EXISTS audit_brand_kits_trigger ON public.brand_kits;
CREATE TRIGGER audit_brand_kits_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.brand_kits
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Add audit trigger for content_items
DROP TRIGGER IF EXISTS audit_content_items_trigger ON public.content_items;
CREATE TRIGGER audit_content_items_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.content_items
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();