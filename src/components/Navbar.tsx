
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Database, MessageSquare, LogIn, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { robustSignOut } from '@/utils/auth';

const Navbar = () => {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
    });
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session?.user);
    });
    return () => sub.data.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-between border-b px-6 py-3 bg-white">
      <div className="flex items-center gap-2">
        <Link to="/" className="font-bold text-xl text-primary">LeadWhisperer</Link>
      </div>
      
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads, companies or posts..." 
            className="pl-8 w-full rounded-lg"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <Link to="/prospecting">
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Prospecting
          </Button>
        </Link>
        {isAuthed ? (
          <Button size="sm" onClick={() => robustSignOut('/auth')}>
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar sesión
            </Button>
          </Link>
        )}
        <Button size="sm" className="bg-accent hover:bg-accent/90">
          New Scan
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
