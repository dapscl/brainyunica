import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  TrendingUp,
  Instagram,
  Globe,
  ArrowRight,
  Loader2,
  Check,
  Palette,
  Type,
  Hash,
  Lightbulb,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BrandScanResult {
  brandName: string;
  tone: string;
  style: string;
  colors: string[];
  keywords: string[];
  personality: string;
  contentSuggestions: string[];
}

type Step = 'input' | 'scanning' | 'results' | 'signup' | 'complete';

const TrialPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('input');
  const [inputType, setInputType] = useState<'instagram' | 'website'>('instagram');
  const [handle, setHandle] = useState('');
  const [scanResult, setScanResult] = useState<BrandScanResult | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in - redirect to brands
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate('/brands', { replace: true });
      } else {
        setCheckingAuth(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && step === 'complete') {
        // Only redirect after signup is complete
        navigate('/brands', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, step]);

  const handleScan = async () => {
    if (!handle.trim()) {
      toast.error('Por favor ingresa un handle de Instagram o URL');
      return;
    }

    setStep('scanning');

    try {
      const response = await fetch(
        `https://fynwkhlwdvezajlkodrs.supabase.co/functions/v1/brand-scanner`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle: handle.trim(), type: inputType })
        }
      );

      const data = await response.json();

      if (data.success) {
        setScanResult(data.data);
        setStep('results');
      } else {
        throw new Error(data.error || 'Error al escanear la marca');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Error al analizar la marca. Intenta de nuevo.');
      setStep('input');
    }
  };

  const handleGenerateIdeas = () => {
    setStep('signup');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            brand_handle: handle,
            brand_type: inputType,
            brand_name: scanResult?.brandName
          }
        }
      });

      if (authError) throw authError;

      // Send notification to admin
      await fetch(
        `https://fynwkhlwdvezajlkodrs.supabase.co/functions/v1/trial-signup-notification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            brandHandle: handle,
            brandType: inputType,
            brandName: scanResult?.brandName || 'No detectado',
            detectedTone: scanResult?.tone || 'No detectado',
            detectedStyle: scanResult?.style || 'No detectado'
          })
        }
      );

      setStep('complete');
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const scanningMessages = [
    'Conectando con la marca...',
    'Analizando publicaciones...',
    'Detectando tono de voz...',
    'Identificando paleta de colores...',
    'Extrayendo palabras clave...',
    'Generando perfil de marca...'
  ];

  const [scanMessageIndex, setScanMessageIndex] = useState(0);

  // Rotate scanning messages
  useState(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setScanMessageIndex(prev => (prev + 1) % scanningMessages.length);
      }, 800);
      return () => clearInterval(interval);
    }
  });

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-electric-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseSEO 
        title="Prueba Gratis 45 Días | Brainy"
        description="Prueba Brainy gratis durante 45 días. Escanea tu marca y genera contenido con IA."
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <AnimatePresence mode="wait">
          {/* Step 1: Input */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 mb-6">
                  <Sparkles className="w-4 h-4 text-electric-cyan" />
                  <span className="text-sm text-electric-cyan font-medium">45 días gratis</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-electric-cyan via-purple-accent to-electric-cyan bg-clip-text text-transparent">
                    Escanea tu marca
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Brainy aprenderá tu tono de voz y estilo visual para crear contenido personalizado
                </p>
              </div>

              <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-8">
                <div className="space-y-6">
                  {/* Input type selector */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={inputType === 'instagram' ? 'default' : 'outline'}
                      className={inputType === 'instagram' 
                        ? 'flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                        : 'flex-1 border-border/50 text-muted-foreground hover:text-foreground'}
                      onClick={() => setInputType('instagram')}
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                    <Button
                      type="button"
                      variant={inputType === 'website' ? 'default' : 'outline'}
                      className={inputType === 'website' 
                        ? 'flex-1 bg-gradient-to-r from-electric-cyan to-blue-500 text-white' 
                        : 'flex-1 border-border/50 text-muted-foreground hover:text-foreground'}
                      onClick={() => setInputType('website')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Sitio Web
                    </Button>
                  </div>

                  {/* Input field */}
                  <div className="space-y-2">
                    <Label htmlFor="handle" className="text-foreground">
                      {inputType === 'instagram' ? 'Handle de Instagram' : 'URL del sitio web'}
                    </Label>
                    <div className="relative">
                      {inputType === 'instagram' ? (
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      )}
                      <Input
                        id="handle"
                        type="text"
                        placeholder={inputType === 'instagram' ? '@tuempresa' : 'https://tuempresa.com'}
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50 h-12 text-lg"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {inputType === 'instagram' 
                        ? 'Ingresa el @ de tu cuenta de Instagram empresarial'
                        : 'Ingresa la URL completa de tu sitio web'}
                    </p>
                  </div>

                  <Button
                    onClick={handleScan}
                    className="w-full h-14 text-lg bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold shadow-glow-cyan"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Escanear mi marca
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>

              {/* Features preview */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: Sparkles, name: 'CreatorBrainy', color: 'from-purple-500 to-pink-500' },
                  { icon: Calendar, name: 'CalendarBrainy', color: 'from-blue-500 to-cyan-500' },
                  { icon: BarChart3, name: 'AdBrainy', color: 'from-cyan-500 to-green-500' },
                  { icon: MessageSquare, name: 'ChatBrainy', color: 'from-green-500 to-emerald-500' },
                  { icon: TrendingUp, name: 'TrendBrainy', color: 'from-orange-500 to-red-500' }
                ].map((brainy) => (
                  <div key={brainy.name} className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${brainy.color} flex items-center justify-center mb-2`}>
                      <brainy.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-muted-foreground">{brainy.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Scanning */}
          {step === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg mx-auto text-center py-20"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                {/* Animated rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-electric-cyan/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-purple-accent/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                
                {/* Center icon */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-electric-cyan to-purple-accent flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                Analizando tu marca
              </h2>
              
              <motion.p
                key={scanMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-muted-foreground text-lg"
              >
                {scanningMessages[scanMessageIndex]}
              </motion.p>

              <div className="mt-8 flex justify-center gap-2">
                {scanningMessages.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx <= scanMessageIndex ? 'bg-electric-cyan' : 'bg-muted'}`}
                    animate={idx === scanMessageIndex ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 'results' && scanResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">Análisis completado</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-foreground">Perfil de </span>
                  <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                    {scanResult.brandName}
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Hemos analizado tu marca y detectado las siguientes características
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Tone & Style */}
                <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Type className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Tono de voz</h3>
                      <p className="text-sm text-muted-foreground">Cómo te comunicas</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">{scanResult.tone}</p>
                  <p className="text-sm text-muted-foreground mt-2">{scanResult.personality}</p>
                </Card>

                <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-electric-cyan/20 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-electric-cyan" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Estilo visual</h3>
                      <p className="text-sm text-muted-foreground">Tu identidad visual</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-electric-cyan">{scanResult.style}</p>
                  <div className="flex gap-2 mt-3">
                    {scanResult.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-lg border border-white/10"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </Card>

                {/* Keywords */}
                <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Palabras clave</h3>
                      <p className="text-sm text-muted-foreground">Términos frecuentes</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Content suggestions */}
                <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Ideas de contenido</h3>
                      <p className="text-sm text-muted-foreground">Sugerencias personalizadas</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {scanResult.contentSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-electric-cyan/10 to-purple-accent/10 border-electric-cyan/30 p-8 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  ¿Listo para generar contenido con este estilo?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Crea tu cuenta gratis y empieza a generar ideas de contenido personalizado
                </p>
                <Button
                  onClick={handleGenerateIdeas}
                  className="h-14 px-8 text-lg bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold shadow-glow-cyan"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generar Ideas de Contenido
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Signup */}
          {step === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                    Crea tu cuenta
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Acceso completo por 45 días. Sin tarjeta de crédito.
                </p>
              </div>

              <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-8">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 bg-background/50 border-border/50 h-12"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Brand summary */}
                  {scanResult && (
                    <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-sm text-muted-foreground mb-2">Tu marca:</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-electric-cyan to-purple-accent flex items-center justify-center text-white font-bold">
                          {scanResult.brandName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{scanResult.brandName}</p>
                          <p className="text-xs text-muted-foreground">{scanResult.tone} • {scanResult.style}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold shadow-glow-cyan"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        Comenzar mi trial gratis
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Al crear tu cuenta aceptas nuestros términos de servicio y política de privacidad
                  </p>

                  <div className="text-center pt-4 border-t border-border/30">
                    <p className="text-sm text-muted-foreground">
                      ¿Ya tienes una cuenta?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/auth')}
                        className="text-electric-cyan hover:underline font-medium"
                      >
                        Ingresar
                      </button>
                    </p>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Complete */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                  ¡Bienvenido a Brainy!
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Tu cuenta ha sido creada exitosamente. Revisa tu email para confirmar tu cuenta.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/auth')}
                  className="h-14 px-8 text-lg bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold shadow-glow-cyan"
                >
                  Ir al Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-sm text-muted-foreground">
                  Tu trial de 45 días comienza ahora
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrialPage;
