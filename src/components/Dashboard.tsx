
import React, { useState } from 'react';
import LeadCard, { Lead } from './LeadCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsChart from './AnalyticsChart';

// Mock data for the leads
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Rodriguez',
    company: 'TechSolutions',
    position: 'Marketing Director',
    message: "Estoy buscando una agencia de marketing digital para nuestra próxima campaña de lanzamiento. ¿Alguien tiene recomendaciones?",
    date: new Date('2023-05-01'),
    intent: 'high',
    status: 'new'
  },
  {
    id: '2',
    name: 'Maria González',
    company: 'Retail Innovation',
    position: 'CEO',
    message: "Necesitamos un proveedor para mejorar nuestra estrategia de marketing digital. Presupuesto de 15-20K mensual.",
    avatar: "https://i.pravatar.cc/150?img=29",
    date: new Date('2023-05-02'),
    intent: 'high',
    status: 'contacted'
  },
  {
    id: '3',
    name: 'Alejandro Pérez',
    company: 'FinTech Maestro',
    position: 'Head of Growth',
    message: "Experiencias con agencias de content marketing especializadas en sector financiero? Buscamos mejorar nuestro blog.",
    date: new Date('2023-05-03'),
    intent: 'medium',
    status: 'new'
  },
  {
    id: '4',
    name: 'Isabel Martínez',
    company: 'EduTech Inc',
    position: 'CMO',
    message: "Pensando en contratar servicios de SEO. ¿Qué empresas están trayendo buenos resultados en 2023?",
    avatar: "https://i.pravatar.cc/150?img=19",
    date: new Date('2023-05-04'),
    intent: 'medium',
    status: 'qualified'
  },
  {
    id: '5',
    name: 'Javier López',
    company: 'LogiTrans',
    position: 'Digital Manager',
    message: "Alguien ha trabajado con una agencia que maneje bien Google Ads para el sector logístico? Tenemos un cliente interesado.",
    date: new Date('2023-05-05'),
    intent: 'low',
    status: 'new'
  }
];

// Analytics data
const analyticsData = {
  intents: { high: 12, medium: 28, low: 17 },
  status: { new: 35, contacted: 12, qualified: 8, closed: 2 }
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Filter leads based on the active tab
  const getFilteredLeads = () => {
    if (activeTab === 'all') return mockLeads;
    if (activeTab === 'high') return mockLeads.filter(lead => lead.intent === 'high');
    if (activeTab === 'uncontacted') return mockLeads.filter(lead => lead.status === 'new');
    return mockLeads;
  };

  const filteredLeads = getFilteredLeads();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLeads.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Intent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLeads.filter(l => l.intent === 'high').length}</div>
            <p className="text-xs text-muted-foreground">Leads ready for contact</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLeads.filter(l => l.status === 'contacted' || l.status === 'qualified' || l.status === 'closed').length}</div>
            <p className="text-xs text-muted-foreground">Leads in pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Lead Intent Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AnalyticsChart data={analyticsData} />
          </CardContent>
        </Card>
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>Intent Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm font-medium">High Intent</span>
                    <span className="text-sm font-medium">{analyticsData.intents.high}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-intent-high" style={{ width: `${(analyticsData.intents.high / (analyticsData.intents.high + analyticsData.intents.medium + analyticsData.intents.low)) * 100}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm font-medium">Medium Intent</span>
                    <span className="text-sm font-medium">{analyticsData.intents.medium}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-intent-medium" style={{ width: `${(analyticsData.intents.medium / (analyticsData.intents.high + analyticsData.intents.medium + analyticsData.intents.low)) * 100}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm font-medium">Low Intent</span>
                    <span className="text-sm font-medium">{analyticsData.intents.low}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-intent-low" style={{ width: `${(analyticsData.intents.low / (analyticsData.intents.high + analyticsData.intents.medium + analyticsData.intents.low)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Leads</h2>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="high">High Intent</TabsTrigger>
            <TabsTrigger value="uncontacted">Uncontacted</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
