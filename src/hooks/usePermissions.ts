import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'moderator' | 'user';
export type OrgRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'member';

interface PermissionCheck {
  canCreateOrganization: boolean;
  canDeleteOrganization: (orgId: string) => Promise<boolean>;
  canEditOrganization: (orgId: string) => Promise<boolean>;
  canCreateBrand: (orgId: string) => Promise<boolean>;
  canEditBrand: (brandId: string) => Promise<boolean>;
  canDeleteBrand: (brandId: string) => Promise<boolean>;
  canManageMembers: (orgId: string) => Promise<boolean>;
  isGlobalAdmin: boolean;
}

export const usePermissions = (): PermissionCheck & { loading: boolean } => {
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGlobalAdmin();
  }, []);

  const checkGlobalAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsGlobalAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking admin role:", error);
      }

      setIsGlobalAdmin(!!data);
    } catch (error) {
      console.error("Error in checkGlobalAdmin:", error);
      setIsGlobalAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const getOrgRole = async (orgId: string): Promise<OrgRole | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Check if owner
      const { data: org } = await supabase
        .from("organizations")
        .select("owner_id")
        .eq("id", orgId)
        .single();

      if (org?.owner_id === user.id) return 'owner';

      // Check membership role
      const { data: membership } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", orgId)
        .eq("user_id", user.id)
        .single();

      return (membership?.role as OrgRole) || null;
    } catch (error) {
      console.error("Error getting org role:", error);
      return null;
    }
  };

  const canCreateOrganization = true; // Any authenticated user can create

  const canDeleteOrganization = async (orgId: string): Promise<boolean> => {
    if (isGlobalAdmin) return true;
    const role = await getOrgRole(orgId);
    return role === 'owner';
  };

  const canEditOrganization = async (orgId: string): Promise<boolean> => {
    if (isGlobalAdmin) return true;
    const role = await getOrgRole(orgId);
    return role === 'owner' || role === 'admin';
  };

  const canCreateBrand = async (orgId: string): Promise<boolean> => {
    if (isGlobalAdmin) return true;
    const role = await getOrgRole(orgId);
    return role === 'owner' || role === 'admin' || role === 'editor';
  };

  const canEditBrand = async (brandId: string): Promise<boolean> => {
    try {
      if (isGlobalAdmin) return true;

      const { data: brand } = await supabase
        .from("brands")
        .select("organization_id")
        .eq("id", brandId)
        .single();

      if (!brand) return false;

      const role = await getOrgRole(brand.organization_id);
      return role === 'owner' || role === 'admin' || role === 'editor';
    } catch (error) {
      console.error("Error checking brand edit permission:", error);
      return false;
    }
  };

  const canDeleteBrand = async (brandId: string): Promise<boolean> => {
    try {
      if (isGlobalAdmin) return true;

      const { data: brand } = await supabase
        .from("brands")
        .select("organization_id")
        .eq("id", brandId)
        .single();

      if (!brand) return false;

      const role = await getOrgRole(brand.organization_id);
      return role === 'owner' || role === 'admin';
    } catch (error) {
      console.error("Error checking brand delete permission:", error);
      return false;
    }
  };

  const canManageMembers = async (orgId: string): Promise<boolean> => {
    if (isGlobalAdmin) return true;
    const role = await getOrgRole(orgId);
    return role === 'owner' || role === 'admin';
  };

  return {
    canCreateOrganization,
    canDeleteOrganization,
    canEditOrganization,
    canCreateBrand,
    canEditBrand,
    canDeleteBrand,
    canManageMembers,
    isGlobalAdmin,
    loading,
  };
};