import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/auth", { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        navigate("/auth", { replace: true });
      }
      setLoading(false);
    });

    return () => sub.data.subscription.unsubscribe();
  }, [navigate]);

  if (loading) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
