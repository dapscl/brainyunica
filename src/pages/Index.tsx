
import React from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import LeadFilters from '@/components/LeadFilters';
import AutomationSettings from '@/components/AutomationSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Aquí implementaríamos la lógica para filtrar los leads
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">LinkedIn Lead Dashboard</h1>
        
        <Tabs defaultValue="dashboard" className="mb-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="automation">Automatización</TabsTrigger>
            <TabsTrigger value="integration">Integración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <LeadFilters onFilterChange={handleFilterChange} />
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="automation" className="mt-6">
            <AutomationSettings />
          </TabsContent>
          
          <TabsContent value="integration" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Integración con LinkedIn</h2>
              <p className="mb-4">
                Para obtener datos de LinkedIn, necesita instalar la extensión de navegador LeadWhisperer
                y conectar su cuenta de LinkedIn.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">1. Instalar Extensión</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Instale la extensión de navegador para comenzar a capturar leads
                  </p>
                  <div className="flex justify-between">
                    <img src="https://i.pravatar.cc/150?img=3" alt="Extensión" className="w-16 h-16" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Instalar Extensión
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">2. Conectar LinkedIn</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Conecte su cuenta de LinkedIn para acceder a los datos
                  </p>
                  <div className="flex justify-between">
                    <img src="https://i.pravatar.cc/150?img=4" alt="LinkedIn" className="w-16 h-16" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Conectar LinkedIn
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-2">Configuración de Sales Navigator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Si tiene una cuenta de LinkedIn Sales Navigator, puede conectarla para acceder a funcionalidades avanzadas
                </p>
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">LinkedIn Sales Navigator</h4>
                      <p className="text-sm text-muted-foreground">Conecte para acceso a funcionalidades avanzadas</p>
                    </div>
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                      Conectar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
