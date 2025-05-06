
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Database } from 'lucide-react';
import { Lead } from './LeadCard';
import { format } from 'date-fns';

interface LeadDetailProps {
  lead: Lead;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const intentColors = {
    high: "bg-intent-high/10 text-intent-high border-intent-high/20",
    medium: "bg-intent-medium/10 text-intent-medium border-intent-medium/20",
    low: "bg-intent-low/10 text-intent-low border-intent-low/20"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                {lead.avatar ? (
                  <AvatarImage src={lead.avatar} alt={lead.name} />
                ) : (
                  <AvatarFallback className="text-2xl">{getInitials(lead.name)}</AvatarFallback>
                )}
              </Avatar>
              <div className="mt-4 space-y-2">
                <Button size="sm" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" /> Message
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Database className="w-4 h-4 mr-2" /> Save in CRM
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{lead.name}</h2>
                <Badge variant="outline" className={`${intentColors[lead.intent]}`}>
                  {lead.intent.charAt(0).toUpperCase() + lead.intent.slice(1)} Intent
                </Badge>
              </div>
              <p className="text-muted-foreground">{lead.position} at {lead.company}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">LinkedIn Post</h4>
                  <p className="text-sm bg-secondary/50 p-3 rounded-md">{lead.message}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Company</h4>
                    <p className="text-sm">{lead.company}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Position</h4>
                    <p className="text-sm">{lead.position}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Date Detected</h4>
                    <p className="text-sm">{format(lead.date, 'PP')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Lead Info</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                  <p className="text-sm">{lead.name.toLowerCase().replace(' ', '.') + '@' + lead.company.toLowerCase().replace(' ', '') + '.com'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">LinkedIn Profile</h4>
                  <p className="text-sm text-primary hover:underline cursor-pointer">
                    https://linkedin.com/in/{lead.name.toLowerCase().replace(' ', '')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                  <p className="text-sm">Madrid, Spain</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
                  <p className="text-sm">Technology</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Company Size</h4>
                  <p className="text-sm">51-200 employees</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Website</h4>
                  <p className="text-sm text-primary hover:underline cursor-pointer">
                    https://{lead.company.toLowerCase().replace(' ', '')}.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-l-primary pl-4 pb-4">
                  <p className="text-sm text-muted-foreground">{format(lead.date, 'PP')}</p>
                  <h4 className="font-medium">LinkedIn Post Created</h4>
                  <p className="text-sm mt-1">{lead.message}</p>
                </div>
                <div className="border-l-2 border-l-muted pl-4">
                  <p className="text-sm text-muted-foreground">{format(new Date(lead.date.getTime() - 86400000 * 7), 'PP')}</p>
                  <h4 className="font-medium">Company Page Updated</h4>
                  <p className="text-sm mt-1">Updated position to {lead.position}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messaging">
          <Card>
            <CardHeader>
              <CardTitle>Messaging Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-md">
                  <h4 className="font-medium">LinkedIn Connection Request</h4>
                  <p className="text-sm mt-1">
                    Hola {lead.name.split(' ')[0]}, vi tu publicación sobre {lead.message.includes('marketing') ? 'agencia de marketing' : 'servicios'}. 
                    Tenemos experiencia en ayudar a empresas como {lead.company} con soluciones personalizadas. 
                    ¿Te gustaría conectar para discutir cómo podríamos ayudarte?
                  </p>
                  <Button size="sm" className="mt-2">Use Template</Button>
                </div>
                <div className="bg-secondary/50 p-4 rounded-md">
                  <h4 className="font-medium">Follow-up Message</h4>
                  <p className="text-sm mt-1">
                    Hola de nuevo {lead.name.split(' ')[0]}, quería hacer seguimiento a mi mensaje anterior sobre 
                    tu búsqueda de {lead.message.includes('marketing') ? 'agencia de marketing' : 'servicios'}. 
                    ¿Te gustaría agendar una breve llamada esta semana para explorar posibles colaboraciones?
                  </p>
                  <Button size="sm" className="mt-2">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadDetail;
