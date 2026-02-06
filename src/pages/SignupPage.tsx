import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Building2, AlertCircle, Sparkles } from "lucide-react";
import { ShowcaseHeader } from "@/components/showcase/ShowcaseHeader";
import { z } from "zod";
import { isPersonalEmail, getEmailDomain } from "@/lib/blockedDomains";

// Email schema with corporate validation
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Email inválido" })
  .max(255, { message: "Email demasiado largo" });

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    document.title = "Crea tu cuenta - Brainy";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Crea tu cuenta corporativa en Brainy - Solo correos laborales");
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(meta);
    }
  }, []);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate("/select-plan", { replace: true });
      }
    });
  }, [navigate]);

  const emailValidation = useMemo(() => {
    if (!email) return { valid: false, error: null };
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return { valid: false, error: e.errors[0].message };
      }
      return { valid: false, error: "Email inválido" };
    }

    if (isPersonalEmail(email)) {
      const domain = getEmailDomain(email);
      return { 
        valid: false, 
        error: `Los correos @${domain} no están permitidos. Usa tu correo corporativo.` 
      };
    }

    return { valid: true, error: null };
  }, [email]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValidation.valid || loading) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      
      setOtpSent(true);
      toast.success("Código enviado a tu correo");
    } catch (err: any) {
      toast.error(err?.message || "Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || verifying) return;

    setVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (data.session) {
        toast.success("¡Cuenta verificada!");
        navigate("/select-plan", { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message || "Código incorrecto o expirado");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      toast.success("Nuevo código enviado");
    } catch (err: any) {
      toast.error(err?.message || "Error al reenviar el código");
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
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <Card className="bg-card/30 backdrop-blur-sm border-primary/20 shadow-glow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Building2 className="w-16 h-16 text-primary" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
                  />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                {otpSent ? "Verifica tu correo" : "Crea tu cuenta"}
              </CardTitle>
              <CardDescription className="text-base">
                {otpSent 
                  ? `Ingresa el código de 6 dígitos enviado a ${email}`
                  : "Solo correos corporativos. Sin contraseñas."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Correo corporativo
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-background/50"
                      placeholder="tu@empresa.com"
                      autoComplete="email"
                    />
                    
                    {email && !emailValidation.valid && emailValidation.error && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{emailValidation.error}</span>
                      </div>
                    )}

                    {email && emailValidation.valid && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Correo corporativo válido</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!emailValidation.valid || loading}
                    className="w-full text-lg py-6 font-bold uppercase tracking-wide transition-all duration-300"
                  >
                    {loading ? "Enviando..." : "Enviar código de acceso"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Al continuar, aceptas nuestros términos de servicio y política de privacidad.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-foreground font-medium">
                      Código de verificación
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      required
                      disabled={verifying}
                      className="bg-background/50 text-center text-2xl tracking-[0.5em] font-mono"
                      placeholder="000000"
                      autoComplete="one-time-code"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={otp.length !== 6 || verifying}
                    className="w-full text-lg py-6 font-bold uppercase tracking-wide transition-all duration-300"
                  >
                    {verifying ? "Verificando..." : "Verificar código"}
                  </Button>

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Reenviar código
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      Cambiar correo
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-primary hover:underline font-medium"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
