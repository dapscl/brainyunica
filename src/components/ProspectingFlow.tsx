
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lead } from './LeadCard';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';

interface ProspectingFlowProps {
  leads: Lead[];
}

const ProspectingFlow: React.FC<ProspectingFlowProps> = ({ leads }) => {
  const [activeStage, setActiveStage] = useState<string>('new');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const stageLeads = {
    new: leads.filter(l => l.status === 'new'),
    contacted: leads.filter(l => l.status === 'contacted'),
    qualified: leads.filter(l => l.status === 'qualified'),
    closed: leads.filter(l => l.status === 'closed'),
  };

  const leadsByStage = {
    new: stageLeads.new.length,
    contacted: stageLeads.contacted.length,
    qualified: stageLeads.qualified.length,
    closed: stageLeads.closed.length,
  };
  
  const intentColors = {
    high: "bg-intent-high/10 text-intent-high border-intent-high/20",
    medium: "bg-intent-medium/10 text-intent-medium border-intent-medium/20",
    low: "bg-intent-low/10 text-intent-low border-intent-low/20"
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Prospecting Workflow</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['new', 'contacted', 'qualified', 'closed'] as const).map((stage) => (
          <Card 
            key={stage} 
            className={`cursor-pointer hover:border-primary transition-colors ${activeStage === stage ? 'border-primary' : ''}`}
            onClick={() => setActiveStage(stage)}
          >
            <CardContent className="p-4">
              <div className="font-semibold capitalize">{stage}</div>
              <div className="text-3xl font-bold">{leadsByStage[stage]}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stage === 'new' ? 'Leads to contact' : stage === 'contacted' ? 'Pending response' : 
                 stage === 'qualified' ? 'In negotiation' : 'Won deals'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="capitalize">{activeStage} Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {stageLeads[activeStage as keyof typeof stageLeads].length > 0 ? (
                <div className="space-y-4">
                  {stageLeads[activeStage as keyof typeof stageLeads].map((lead) => (
                    <div 
                      key={lead.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${selectedLead?.id === lead.id ? 'bg-muted border-primary' : ''}`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{lead.name}</h3>
                          <p className="text-sm text-muted-foreground">{lead.position} at {lead.company}</p>
                        </div>
                        <Badge variant="outline" className={`${intentColors[lead.intent]}`}>
                          {lead.intent.charAt(0).toUpperCase() + lead.intent.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-[200px] text-muted-foreground">
                  No leads in this stage
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Lead Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLead ? (
                <Tabs defaultValue="message">
                  <TabsList className="mb-4">
                    <TabsTrigger value="message">Message</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="move">Move Stage</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="message">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Message Template</h4>
                        <Select defaultValue="custom">
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="initial">Initial Contact</SelectItem>
                            <SelectItem value="followup">Follow-up</SelectItem>
                            <SelectItem value="meeting">Meeting Request</SelectItem>
                            <SelectItem value="custom">Custom Message</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Message</h4>
                        <Textarea 
                          className="min-h-[150px]"
                          defaultValue={`Hola ${selectedLead.name.split(' ')[0]},\n\nVi tu publicación sobre "${selectedLead.message.substring(0, 30)}..."\n\n¿Podríamos agendar una breve llamada para discutir cómo podríamos ayudarte con esto?\n\nSaludos,\nTu Nombre`}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Save Draft</Button>
                        <Button>Send Message</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Lead Notes</h4>
                        <Textarea 
                          className="min-h-[150px]"
                          placeholder="Add notes about this lead..."
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Save Notes</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="move">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Current Stage</h4>
                        <div className="bg-muted p-2 rounded-md">
                          <span className="capitalize">{selectedLead.status}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Move to Stage</h4>
                        <Select defaultValue={selectedLead.status}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Reason for Change</h4>
                        <Input placeholder="Briefly explain the reason for this change..." />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Update Stage</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex justify-center items-center h-[300px] text-center text-muted-foreground">
                  <div>
                    <p>Select a lead from the list to view details and take action</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProspectingFlow;
