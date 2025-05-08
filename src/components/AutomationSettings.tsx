
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MessageSquare, Mail, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import EmailVerifier from './EmailVerifier';
import { useToast } from '@/hooks/use-toast';
import { VerificationResult, VerificationService } from '@/services/emailVerificationService';

const AutomationSettings = () => {
  const [emailVerificationEnabled, setEmailVerificationEnabled] = useState(false);
  const [autoMessageEnabled, setAutoMessageEnabled] = useState(false);
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(false);
  const [verificationService, setVerificationService] = useState<VerificationService>('hunter');
  const [apiKey, setApiKey] = useState('');
  const [bulkVerificationMode, setBulkVerificationMode] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración de automatización ha sido actualizada",
    });
  };

  const handleVerificationResult = (result: VerificationResult) => {
    console.log("Resultado de verificación:", result);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Configuración de Automatización</CardTitle>
        <CardDescription>
          Configure las opciones para automatizar el proceso de prospección
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="messages">
          <TabsList className="mb-4">
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensajes
            </TabsTrigger>
            <TabsTrigger value="scheduling">
              <Calendar className="h-4 w-4 mr-2" />
              Agendamiento
            </TabsTrigger>
            <TabsTrigger value="verification">
              <Mail className="h-4 w-4 mr-2" />
              Verificación
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mensajes automáticos</h3>
                <p className="text-sm text-muted-foreground">
                  Enviar mensajes automáticos a leads basados en su intención
                </p>
              </div>
              <Switch 
                checked={autoMessageEnabled}
                onCheckedChange={setAutoMessageEnabled}
              />
            </div>
            
            {autoMessageEnabled && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="message-template">Plantilla para alta intención</Label>
                  <Textarea 
                    id="message-template"
                    placeholder="Hola {{nombre}}, vi tu publicación sobre..."
                    className="mt-1"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {"{{nombre}}"}, {"{{empresa}}"}, {"{{puesto}}"} para personalizar el mensaje
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="follow-up-days">Días hasta seguimiento</Label>
                    <Select defaultValue="3">
                      <SelectTrigger id="follow-up-days">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 día</SelectItem>
                        <SelectItem value="2">2 días</SelectItem>
                        <SelectItem value="3">3 días</SelectItem>
                        <SelectItem value="5">5 días</SelectItem>
                        <SelectItem value="7">1 semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="max-follow-ups">Máximo seguimientos</Label>
                    <Select defaultValue="2">
                      <SelectTrigger id="max-follow-ups">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 seguimiento</SelectItem>
                        <SelectItem value="2">2 seguimientos</SelectItem>
                        <SelectItem value="3">3 seguimientos</SelectItem>
                        <SelectItem value="5">5 seguimientos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scheduling" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Agendamiento automático</h3>
                <p className="text-sm text-muted-foreground">
                  Proponer automáticamente fechas de reunión cuando responden
                </p>
              </div>
              <Switch 
                checked={autoScheduleEnabled}
                onCheckedChange={setAutoScheduleEnabled}
              />
            </div>
            
            {autoScheduleEnabled && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="calendar-url">URL de Calendly</Label>
                  <Input 
                    id="calendar-url"
                    placeholder="https://calendly.com/tu-usuario/reunion"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meeting-description">Descripción de la reunión</Label>
                  <Textarea 
                    id="meeting-description"
                    placeholder="Reunión para discutir cómo podemos ayudarte con..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Verificación de correos</h3>
                <p className="text-sm text-muted-foreground">
                  Verificar automáticamente correos de los leads
                </p>
              </div>
              <Switch 
                checked={emailVerificationEnabled}
                onCheckedChange={setEmailVerificationEnabled}
              />
            </div>
            
            {emailVerificationEnabled && (
              <div className="space-y-6 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="verification-service">Servicio de verificación</Label>
                    <Select 
                      value={verificationService} 
                      onValueChange={(value) => setVerificationService(value as VerificationService)}
                    >
                      <SelectTrigger id="verification-service">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hunter">Hunter.io</SelectItem>
                        <SelectItem value="clearout">Clearout</SelectItem>
                        <SelectItem value="neverbounce">NeverBounce</SelectItem>
                        <SelectItem value="truemail">TrueMail</SelectItem>
                        <SelectItem value="manual">Verificación manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key"
                      type="password"
                      placeholder="Ingrese su API key"
                      className="mt-1"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Verificación en tiempo real</h4>
                      <p className="text-sm text-muted-foreground">Obtener resultados en tiempo real</p>
                    </div>
                    <Switch
                      checked={bulkVerificationMode}
                      onCheckedChange={setBulkVerificationMode}
                    />
                  </div>
                  {bulkVerificationMode ? (
                    <div className="space-y-3 p-4 bg-muted/30 rounded-md">
                      <h4 className="text-sm font-medium">Verificación por lotes</h4>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept=".csv"
                          className="max-w-xs"
                        />
                        <Button size="sm">
                          <Check className="h-4 w-4 mr-1" /> Subir CSV
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sube un archivo CSV con una columna de emails para verificar en lote
                      </p>
                    </div>
                  ) : (
                    <EmailVerifier 
                      onVerified={handleVerificationResult} 
                    />
                  )}
                </div>
                
                <div className="p-4 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Configuración avanzada</h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm">Verificar al crear lead</p>
                      <p className="text-xs text-muted-foreground">Verificar automáticamente al crear un nuevo lead</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm">Notificaciones de resultados</p>
                      <p className="text-xs text-muted-foreground">Recibir notificaciones por email de los resultados</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="mr-2">Cancelar</Button>
        <Button onClick={handleSaveSettings}>Guardar configuración</Button>
      </CardFooter>
    </Card>
  );
};

export default AutomationSettings;
