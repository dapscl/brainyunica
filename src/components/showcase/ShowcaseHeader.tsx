import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { robustSignOut } from '@/utils/auth';

export const ShowcaseHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await robustSignOut();
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('showcase.nav.home', '¿Qué es Brainy?') },
    { path: '/features', label: t('showcase.nav.features', 'Funcionalidades') },
    { path: '/industries', label: t('showcase.nav.industries', 'Industrias') },
    { path: '/pricing', label: t('showcase.nav.pricing', 'Precio') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-dark-surface/95 backdrop-blur-md supports-[backdrop-filter]:bg-dark-surface/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan to-purple-accent rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-electric-cyan to-purple-accent p-2 rounded-lg">
                <span className="text-dark-surface font-bold text-xl">B</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent leading-tight">
                Brainy
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase hidden sm:block">
                {t('showcase.nav.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-electric-cyan bg-electric-cyan/10'
                      : 'text-white/90 hover:text-electric-cyan hover:bg-electric-cyan/5'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right side - Language Selector + CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector />
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            ) : (
              <>
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-electric-cyan hover:bg-electric-cyan/5 transition-all duration-300"
                  >
                    {t('showcase.nav.login', 'Acceso')}
                  </Button>
                </Link>
                <Link to="/trial">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-500/70 transition-all duration-300"
                  >
                    {t('showcase.nav.freeTrial', 'Prueba Gratis')}
                  </Button>
                </Link>
                <Link to="/lead-capture">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold shadow-glow-cyan transition-all duration-300"
                  >
                    {t('showcase.nav.requestDemo', 'Solicitar Demo')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-electric-cyan transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/40 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-electric-cyan bg-electric-cyan/10'
                      : 'text-white/90 hover:text-electric-cyan hover:bg-electric-cyan/5'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <LanguageSelector />
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </Button>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full text-white/80 hover:text-electric-cyan hover:bg-electric-cyan/5"
                    >
                      {t('showcase.nav.login', 'Acceso')}
                    </Button>
                  </Link>
                  <Link to="/trial" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
                    >
                      {t('showcase.nav.freeTrial', 'Prueba Gratis')}
                    </Button>
                  </Link>
                  <Link to="/lead-capture" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      className="w-full bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold"
                    >
                      {t('showcase.nav.requestDemo', 'Solicitar Demo')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
