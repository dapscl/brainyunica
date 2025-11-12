import { Link, useLocation } from 'react-router-dom';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const ShowcaseHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Right side - Language Selector + CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/auth">
              <Button
                variant="outline"
                size="sm"
                className="border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10 transition-all duration-300"
              >
                {t('showcase.nav.login', 'Acceso')}
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
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10"
                >
                  {t('showcase.nav.login', 'Acceso')}
                </Button>
              </Link>
              <Link to="/lead-capture" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold"
                >
                  {t('showcase.nav.requestDemo', 'Solicitar Demo')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
