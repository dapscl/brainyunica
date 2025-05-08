
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MessageSquare } from 'lucide-react';

const AutomationSettings = () => {
  const [emailVerificationEnabled, setEmailVerificationEnabled] = React.useState(false);
  const [autoMessageEnabled, setAutoMessageEnabled] = React.useState(false);
  const [autoScheduleEnabled, setAutoScheduleEnabled] = React.useState(false);

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
              <Clock className="h-4 w-4 mr-2" />
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
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="verification-service">Servicio de verificación</Label>
                  <Select defaultValue="hunter">
                    <SelectTrigger id="verification-service">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hunter">Hunter.io</SelectItem>
                      <SelectItem value="clearout">Clearout</SelectItem>
                      <SelectItem value="neverbounce">NeverBounce</SelectItem>
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
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="mr-2">Cancelar</Button>
        <Button>Guardar configuración</Button>
      </CardFooter>
    </Card>
  );
};

export default AutomationSettings;
