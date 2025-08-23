import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    document.title = isSignup ? "Crear cuenta | LeadWhisper" : "Iniciar sesión | LeadWhisper";
    const desc = isSignup
      ? "Crear cuenta en LeadWhisper para gestionar tus leads."
      : "Inicia sesión en LeadWhisper para acceder a tu dashboard de leads.";
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
        navigate("/", { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, [navigate]);

  const canSubmit = useMemo(() => email.length > 3 && password.length >= 6 && !loading, [email, password, loading]);

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
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast.success("Revisa tu email para confirmar el registro.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Full reload after auth per best practices
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error(err?.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignup ? "Crear cuenta" : "Iniciar sesión"}</CardTitle>
          <CardDescription>
            {isSignup ? "Regístrate con tu email y una contraseña segura." : "Accede con tu email y contraseña."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
                <button className="underline" onClick={() => setIsSignup(false)}>Inicia sesión</button>
              </span>
            ) : (
              <span>
                ¿No tienes cuenta?{" "}
                <button className="underline" onClick={() => setIsSignup(true)}>Crea una</button>
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center mt-6">
            <Link to="/">Volver al inicio</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
