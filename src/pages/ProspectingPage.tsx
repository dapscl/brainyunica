
import React from 'react';
import Navbar from '@/components/Navbar';
import ProspectingFlow from '@/components/ProspectingFlow';
import { Lead } from '@/components/LeadCard';
import LeadFilters from '@/components/LeadFilters';

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
  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Aquí implementaríamos la lógica para filtrar los leads
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Prospecting Workflow</h1>
        <LeadFilters onFilterChange={handleFilterChange} />
        <ProspectingFlow leads={mockLeads} />
      </div>
    </div>
  );
};

export default ProspectingPage;
