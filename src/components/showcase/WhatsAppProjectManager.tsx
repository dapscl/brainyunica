import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Settings, TrendingUp, CheckCircle2, Clock, Sparkles, Calendar } from "lucide-react";

const WhatsAppProjectManager = () => {
  const { toast } = useToast();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  const handleEnableWhatsApp = () => {
    if (!whatsappNumber) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número de WhatsApp Business",
        variant: "destructive",
      });
      return;
    }

    setIsEnabled(true);
    toast({
      title: "✅ WhatsApp Project Manager Activado",
      description: "BrainybyUnica está listo para gestionar tu marca de forma conversacional",
    });
  };

  const mockConversations = [
    {
      id: 1,
      brand: "TechStart",
      lastMessage: "Perfecto, publica a las 3 PM 🚀",
      time: "Hace 2 min",
      unread: 0,
      status: "active",
      lastAction: "approval",
    },
    {
      id: 2,
      brand: "EcoGreen",
      lastMessage: "Sugiere versión 💡",
      time: "Hace 15 min",
      unread: 2,
      status: "waiting",
      lastAction: "content_edit",
    },
    {
      id: 3,
      brand: "FitLife",
      lastMessage: "Tendencias de la semana 📈",
      time: "Hace 1 hora",
      unread: 0,
      status: "active",
      lastAction: "suggestions",
    },
  ];

  const mockSuggestions = [
    {
      id: 1,
      title: "IA en marketing 2026",
      description: "El día que tu agencia dejó de dormir",
      score: 95,
      status: "pending",
      source: "Google Trends + TechCrunch",
    },
    {
      id: 2,
      title: "Automatización creativa",
      description: "Creatividad en piloto automático",
      score: 88,
      status: "approved",
      source: "The Drum + RSS Feeds",
    },
    {
      id: 3,
      title: "WhatsApp como canal principal",
      description: "Gestión completa desde tu móvil",
      score: 82,
      status: "pending",
      source: "Marketing Directo",
    },
  ];

  const conversationExample = [
    {
      sender: "brainy",
      message: "Hola, Carolina. ☀️ Hoy tenemos este contenido pre-aprobado para publicar a las 12:00:",
      time: "09:30",
    },
    {
      sender: "brainy",
      message: "🧩 'Los lunes son para planificar. Pero si BrainybyUnica lo hace solo, ¿qué haces tú?'",
      time: "09:30",
    },
    {
      sender: "brainy",
      message: "¿Quieres revisarlo antes de que salga?\n✅ Sí / ❌ No",
      time: "09:30",
    },
    {
      sender: "user",
      message: "Sí, quiero hacer un cambio",
      time: "09:35",
    },
    {
      sender: "brainy",
      message: "Perfecto 💡\nAquí tienes el copy editable. Escríbeme el nuevo texto o dime 'sugiere versión'.",
      time: "09:35",
    },
    {
      sender: "user",
      message: "Sugiere versión",
      time: "09:36",
    },
    {
      sender: "brainy",
      message: "'Mientras otros planifican su lunes, tu contenido ya está al aire. Así de fácil con BrainybyUnica.'\n\n¿Publicamos este? ✅ Sí / 🔁 Probar otra / ❌ Cancelar",
      time: "09:36",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            WhatsApp Project Manager
          </h2>
          <p className="text-muted-foreground mt-2">
            Cada marca tiene su gestor personal de contenido por WhatsApp
          </p>
        </div>
        <Sparkles className="h-12 w-12 text-primary" />
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Aprobación Instantánea</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Revisa y aprueba contenido directamente desde WhatsApp con respuestas simples
          </p>
        </Card>
        
        <Card className="p-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Sugerencias con IA</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            BrainybyUnica te propone contenido basado en tendencias cada lunes automáticamente
          </p>
        </Card>
        
        <Card className="p-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Programación Simple</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Calendariza publicaciones conversacionalmente: "Mañana a las 9 AM"
          </p>
        </Card>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Configuración</TabsTrigger>
          <TabsTrigger value="conversations">Conversaciones</TabsTrigger>
          <TabsTrigger value="suggestions">Sugerencias</TabsTrigger>
          <TabsTrigger value="example">Ejemplo en Vivo</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">WhatsApp Business API</h3>
                  <p className="text-sm text-muted-foreground">
                    Un número único por cada brand set
                  </p>
                </div>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">Número de WhatsApp Business</Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsapp"
                    placeholder="+1 234 567 8900"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    disabled={isEnabled}
                  />
                  <Button onClick={handleEnableWhatsApp} disabled={isEnabled}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  ¿Cómo funciona el flujo operativo?
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>📱 <strong>WhatsApp / Manychat</strong> → Interfaz conversacional</p>
                  <p>🧠 <strong>BrainybyUnica Logic (Lovable)</strong> → Procesamiento inteligente</p>
                  <p>💾 <strong>Supabase</strong> → Estado de proyectos y aprobaciones</p>
                  <p>✨ <strong>OpenAI GPT-5</strong> → Generación y optimización de contenido</p>
                  <p>📊 <strong>Google Trends + RSS</strong> → Captación de tendencias</p>
                </div>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Capacidades del Project Manager</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✅ Aprobación de contenido por WhatsApp</li>
                  <li>📝 Edición y reescritura con GPT-5 en tiempo real</li>
                  <li>📈 Sugerencias semanales basadas en tendencias</li>
                  <li>📅 Programación conversacional de publicaciones</li>
                  <li>🔔 Notificaciones y recordatorios inteligentes</li>
                  <li>📊 Estados de campañas en tiempo real</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <div className="grid gap-4">
            {mockConversations.map((conv) => (
              <Card key={conv.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{conv.brand}</h4>
                      {conv.status === "active" && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      )}
                      {conv.status === "waiting" && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Esperando respuesta
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {conv.lastAction === "approval" && "Aprobación"}
                        {conv.lastAction === "content_edit" && "Edición"}
                        {conv.lastAction === "suggestions" && "Tendencias"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.unread > 0 && (
                      <Badge variant="default" className="rounded-full">
                        {conv.unread}
                      </Badge>
                    )}
                    <Button size="sm" variant="outline">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Sugerencias de la Semana</h3>
                <p className="text-sm text-muted-foreground">Basadas en Google Trends y RSS Feeds</p>
              </div>
              <Button size="sm" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
            <div className="space-y-3">
              {mockSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      Score: {suggestion.score}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.source}
                    </Badge>
                    {suggestion.status === "approved" && (
                      <Badge variant="default" className="text-xs">
                        ✅ Aprobado
                      </Badge>
                    )}
                    {suggestion.status === "pending" && (
                      <Badge variant="outline" className="text-xs">
                        ⏳ Pendiente
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="example" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversación Real con BrainybyUnica</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {conversationExample.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppProjectManager;