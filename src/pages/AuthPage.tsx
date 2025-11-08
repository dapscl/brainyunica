import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, Link } from "react-router-dom";
import { cleanupAuthState } from "@/utils/auth";
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    document.title = isSignup ? "Crear cuenta - ÚNICA" : "Iniciar sesión - ÚNICA";
    const desc = isSignup
      ? "Crea tu cuenta en ÚNICA Command Center y centraliza tu agencia creativa"
      : "Accede a ÚNICA Command Center - La plataforma integral para agencias";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [isSignup]);

  useEffect(() => {
    // Redirect if already logged in
    const sub = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/dashboard", { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, [navigate]);

  const canSubmit = useMemo(() => email.length > 3 && password.length >= 6 && !loading, [email, password, loading]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      cleanupAuthState();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err?.message || "Error al conectar con Google");
      setLoading(false);
    }
  };

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
        const redirectUrl = `${window.location.origin}/dashboard`;
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
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      toast.error(err?.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-glow">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignup ? "Crear cuenta en ÚNICA" : "Bienvenido a ÚNICA"}
          </CardTitle>
          <CardDescription>
            {isSignup ? "Regístrate y empieza tu prueba gratuita de 14 días" : "Accede a tu Command Center"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn} 
              disabled={loading} 
              variant="outline" 
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {loading ? "Conectando..." : "Continuar con Google"}
            </Button>
            
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">O continúa con email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={!canSubmit} className="w-full">
              {loading ? "Procesando..." : isSignup ? "Crear cuenta" : "Iniciar sesión"}
            </Button>
          </form>

          <div className="text-sm text-center mt-4">
            {isSignup ? (
              <span>
                ¿Ya tienes cuenta?{" "}
                <button className="text-primary hover:underline" onClick={() => setIsSignup(false)}>
                  Inicia sesión
                </button>
              </span>
            ) : (
              <span>
                ¿No tienes cuenta?{" "}
                <button className="text-primary hover:underline" onClick={() => setIsSignup(true)}>
                  Crear cuenta gratis
                </button>
              </span>
            )}
          </div>

          <div className="text-sm text-muted-foreground text-center mt-6">
            <Link to="/" className="hover:text-primary">← Volver al inicio</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
