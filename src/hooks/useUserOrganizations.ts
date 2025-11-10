import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  owner_id: string;
}

export const useUserOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get organizations where user is owner or member
      const { data: ownedOrgs } = await supabase
        .from("organizations")
        .select("*")
        .eq("owner_id", user.id);

      const { data: memberships } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id);

      const memberOrgIds = memberships?.map(m => m.organization_id) || [];

      if (memberOrgIds.length > 0) {
        const { data: memberOrgs } = await supabase
          .from("organizations")
          .select("*")
          .in("id", memberOrgIds);

        const allOrgs = [...(ownedOrgs || []), ...(memberOrgs || [])];
        // Remove duplicates
        const uniqueOrgs = allOrgs.filter((org, index, self) =>
          index === self.findIndex((t) => t.id === org.id)
        );
        setOrganizations(uniqueOrgs);
      } else {
        setOrganizations(ownedOrgs || []);
      }
    } catch (error) {
      console.error("Error loading organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  return { organizations, loading, reload: loadOrganizations };
};
