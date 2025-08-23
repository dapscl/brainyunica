import { supabase } from "@/integrations/supabase/client";

// Clean up any leftover Supabase auth state to prevent limbo states
export const cleanupAuthState = () => {
  try {
    // Standard known keys
    localStorage.removeItem("supabase.auth.token");

    // Remove all Supabase auth related keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });

    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (err) {
    // no-op
  }
};

export const robustSignOut = async (redirectTo: string = "/auth") => {
  try {
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (err) {
      // Ignore errors
    }
  } finally {
    // Force full page reload to ensure a clean state
    window.location.href = redirectTo;
  }
};
