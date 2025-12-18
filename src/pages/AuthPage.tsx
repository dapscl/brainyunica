import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { cleanupAuthState } from "@/utils/auth";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowLeft, Check, X } from 'lucide-react';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { z } from 'zod';

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, { message: "Mínimo 8 caracteres" })
  .regex(/[A-Z]/, { message: "Al menos una mayúscula" })
  .regex(/[a-z]/, { message: "Al menos una minúscula" })
  .regex(/[0-9]/, { message: "Al menos un número" });

const emailSchema = z.string().email({ message: "Email inválido" }).trim().toLowerCase();

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // Password strength checks
  const passwordChecks = useMemo(() => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }), [password]);

  const isPasswordValid = useMemo(() => 
    Object.values(passwordChecks).every(Boolean), 
    [passwordChecks]
  );

  const isEmailValid = useMemo(() => {
    try {
      emailSchema.parse(email);
      return true;
    } catch {
      return false;
    }
  }, [email]);

  useEffect(() => {
    document.title = isSignup ? "Crear cuenta - Brainy" : "Iniciar sesión - Brainy";
    const desc = isSignup
      ? "Crea tu cuenta en Brainy y automatiza tu marketing con IA"
      : "Accede a Brainy - Marketing que se dirige solo";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [isSignup]);

  useEffect(() => {
    const from = (location.state as any)?.from?.pathname || '/trial';
    const sub = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate(from, { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate(from, { replace: true });
      }
    });

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, [navigate, location]);

  // For signup: require strong password. For login: just check non-empty
  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (!isEmailValid) return false;
    if (isSignup) {
      return isPasswordValid;
    }
    return password.length >= 6; // Login accepts existing passwords
  }, [email, password, loading, isSignup, isEmailValid, isPasswordValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch {}

      if (isSignup) {
        const redirectUrl = `${window.location.origin}/trial`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast.success("Revisa tu email para confirmar el registro");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const from = (location.state as any)?.from?.pathname || '/trial';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al showcase
          </Button>

          <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 shadow-glow-cyan">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Lock className="w-16 h-16 text-electric-cyan animate-pulse" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full"
                  />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold uppercase tracking-tight">
                {isSignup ? 'Registro' : 'Acceso Demo'}
              </CardTitle>
              <CardDescription className="text-base font-light">
                {isSignup 
                  ? "Crea una cuenta para acceder al demo completo"
                  : "Ingresa tus credenciales para acceder al demo"}
              </CardDescription>
            </CardHeader>
            <CardContent>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                disabled={loading}
                className="bg-background/50"
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                <Lock className="w-4 h-4 inline mr-2" />
                Contraseña
              </Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                disabled={loading}
                className="bg-background/50"
                placeholder="••••••••"
              />
              
              {/* Password strength indicator - only show during signup */}
              {isSignup && password.length > 0 && (
                <div className="mt-3 space-y-2 p-3 rounded-lg bg-card/50 border border-border/50">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Requisitos de contraseña:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${passwordChecks.minLength ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {passwordChecks.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      8+ caracteres
                    </div>
                    <div className={`flex items-center gap-1 ${passwordChecks.hasUppercase ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {passwordChecks.hasUppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Una mayúscula
                    </div>
                    <div className={`flex items-center gap-1 ${passwordChecks.hasLowercase ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {passwordChecks.hasLowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Una minúscula
                    </div>
                    <div className={`flex items-center gap-1 ${passwordChecks.hasNumber ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {passwordChecks.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Un número
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={!canSubmit} 
              className="w-full text-lg py-6 bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan transition-all duration-300"
            >
              {loading ? "Procesando..." : isSignup ? "Crear Cuenta" : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="text-center mt-6">
            {isSignup ? (
              <button className="text-electric-cyan hover:underline text-sm font-medium" onClick={() => setIsSignup(false)}>
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            ) : (
              <button className="text-electric-cyan hover:underline text-sm font-medium" onClick={() => setIsSignup(true)}>
                ¿No tienes cuenta? Regístrate
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</div>
  );
};

export default AuthPage;
