import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrialStatus {
  isInTrial: boolean;
  daysRemaining: number;
  trialEndsAt: Date | null;
  subscriptionStatus: string;
}

export const useTrialStatus = (organizationId?: string) => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isInTrial: false,
    daysRemaining: 0,
    trialEndsAt: null,
    subscriptionStatus: 'none'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchTrialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("organizations")
          .select("trial_ends_at, subscription_status")
          .eq("id", organizationId)
          .single();

        if (error) throw error;

        if (data?.trial_ends_at) {
          const trialEndsAt = new Date(data.trial_ends_at);
          const now = new Date();
          const diffTime = trialEndsAt.getTime() - now.getTime();
          const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          setTrialStatus({
            isInTrial: daysRemaining > 0 && data.subscription_status === 'trial',
            daysRemaining: Math.max(0, daysRemaining),
            trialEndsAt,
            subscriptionStatus: data.subscription_status || 'none'
          });
        }
      } catch (error) {
        console.error("Error fetching trial status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrialStatus();
  }, [organizationId]);

  return { ...trialStatus, loading };
};
