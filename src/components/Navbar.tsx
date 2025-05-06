
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Database, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navbar = () => {
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
        <Button size="sm" className="bg-accent hover:bg-accent/90">
          New Scan
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
