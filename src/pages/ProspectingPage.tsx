
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProspectingFlow from '@/components/ProspectingFlow';
import { Lead } from '@/components/LeadCard';
import LeadFilters from '@/components/LeadFilters';
import { LeadFilters as LeadFiltersType } from '@/components/LeadFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AutomationSettings from '@/components/AutomationSettings';
import IntentAnalyzer from '@/components/IntentAnalyzer';

// Datos de ejemplo para los leads con información de país
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Rodriguez',
    company: 'TechSolutions',
    position: 'Marketing Director',
    message: "Estoy buscando una agencia de marketing digital para nuestra próxima campaña de lanzamiento. ¿Alguien tiene recomendaciones?",
    date: new Date('2023-05-01'),
    intent: 'high',
    status: 'new',
    country: 'es',
    email: 'carlos@techsolutions.es',
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
    status: 'contacted',
    country: 'mx',
    email: 'maria@retailinnovation.mx',
    emailVerified: true,
    lastContactDate: new Date('2023-05-03')
  },
  {
    id: '3',
    name: 'Alejandro Pérez',
    company: 'FinTech Maestro',
    position: 'Head of Growth',
    message: "Experiencias con agencias de content marketing especializadas en sector financiero? Buscamos mejorar nuestro blog.",
    date: new Date('2023-05-03'),
    intent: 'medium',
    status: 'new',
    country: 'co',
    email: 'aperez@fintechmaestro.co'
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
    status: 'qualified',
    country: 'ar',
    email: 'isabel@edutech.com.ar',
    emailVerified: true,
    lastContactDate: new Date('2023-05-05')
  },
  {
    id: '5',
    name: 'Javier López',
    company: 'LogiTrans',
    position: 'Digital Manager',
    message: "Alguien ha trabajado con una agencia que maneje bien Google Ads para el sector logístico? Tenemos un cliente interesado.",
    date: new Date('2023-05-05'),
    intent: 'low',
    status: 'new',
    country: 'cl',
    email: 'javier.lopez@logitrans.cl'
  }
];

const ProspectingPage = () => {
  const [activeTab, setActiveTab] = useState("workflow");
  const [filteredLeads, setFilteredLeads] = useState(mockLeads);

  const handleFilterChange = (filters: LeadFiltersType) => {
    console.log('Filters changed:', filters);
    
    // Implementamos la lógica para filtrar los leads
    let results = [...mockLeads];
    
    // Filtrar por búsqueda
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm) ||
        lead.company.toLowerCase().includes(searchTerm) ||
        lead.position.toLowerCase().includes(searchTerm) ||
        lead.message.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por intención
    if (filters.intent && filters.intent !== 'all') {
      results = results.filter(lead => lead.intent === filters.intent);
    }
    
    // Filtrar por país
    if (filters.country && filters.country !== 'all') {
      results = results.filter(lead => lead.country === filters.country);
    }
    
    // Filtrar por estado
    if (filters.status && filters.status !== 'all') {
      results = results.filter(lead => lead.status === filters.status);
    }
    
    setFilteredLeads(results);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Prospecting Workflow</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="workflow">Flujo de Trabajo</TabsTrigger>
            <TabsTrigger value="intent">Análisis de Intención</TabsTrigger>
            <TabsTrigger value="automation">Automatización</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflow" className="space-y-6">
            <LeadFilters onFilterChange={handleFilterChange} />
            <ProspectingFlow leads={filteredLeads} />
          </TabsContent>
          
          <TabsContent value="intent">
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <IntentAnalyzer onIntentAnalyzed={(result) => {
                  console.log('Intent analysis result:', result);
                }} />
              </div>
              
              <div className="md:col-span-7">
                <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
                  <h2 className="text-xl font-semibold mb-4">Configuración de Análisis</h2>
                  <p className="text-muted-foreground mb-6">
                    Configure los parámetros para el análisis automático de intención y clasificación de leads.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-2">Palabras clave de alta intención</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Estas palabras indican una alta probabilidad de decisión de compra
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {['necesito', 'urgente', 'presupuesto', 'cotización', 'contratar', 'comprar', 'implementar'].map(keyword => (
                          <div key={keyword} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                            {keyword}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2">Umbrales de clasificación</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Defina los umbrales para clasificar automáticamente los leads
                      </p>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Alta intención</span>
                            <span className="text-sm font-medium">70+</span>
                          </div>
                          <div className="h-2 bg-green-200 rounded-full"></div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Media intención</span>
                            <span className="text-sm font-medium">40-70</span>
                          </div>
                          <div className="h-2 bg-yellow-200 rounded-full"></div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Baja intención</span>
                            <span className="text-sm font-medium">0-40</span>
                          </div>
                          <div className="h-2 bg-red-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2">Conexión con LinkedIn</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Estado de la conexión con LinkedIn para la captura de leads
                      </p>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-yellow-400 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-yellow-800">Extensión pendiente de instalar</span>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          Para comenzar a capturar leads, instale la extensión de navegador
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="automation">
            <AutomationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProspectingPage;
