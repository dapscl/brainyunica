import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, LogOut, Building2, User, Home, Moon, Sun, BarChart3 } from "lucide-react";
import { robustSignOut } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { LanguageSelector } from "@/components/layout/LanguageSelector";

interface Profile {
  full_name: string | null;
  email: string;
}

export const AppHeader = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
      
      if (data) setProfile(data);
    }
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <Package className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none">BrainybyUnica</span>
              <span className="text-xs text-muted-foreground leading-none">Command Center</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/organizations")}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Organizaciones
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {profile?.full_name || profile?.email || "Usuario"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/organizations")}>
                <Building2 className="h-4 w-4 mr-2" />
                Organizaciones
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/analytics")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => robustSignOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
