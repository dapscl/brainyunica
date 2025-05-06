
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LeadDetail from '@/components/LeadDetail';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Lead } from '@/components/LeadCard';

// Mock data for a single lead
const mockLeads: Record<string, Lead> = {
  '1': {
    id: '1',
    name: 'Carlos Rodriguez',
    company: 'TechSolutions',
    position: 'Marketing Director',
    message: "Estoy buscando una agencia de marketing digital para nuestra próxima campaña de lanzamiento. ¿Alguien tiene recomendaciones?",
    date: new Date('2023-05-01'),
    intent: 'high',
    status: 'new'
  },
  '2': {
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
  '3': {
    id: '3',
    name: 'Alejandro Pérez',
    company: 'FinTech Maestro',
    position: 'Head of Growth',
    message: "Experiencias con agencias de content marketing especializadas en sector financiero? Buscamos mejorar nuestro blog.",
    date: new Date('2023-05-03'),
    intent: 'medium',
    status: 'new'
  },
  '4': {
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
  '5': {
    id: '5',
    name: 'Javier López',
    company: 'LogiTrans',
    position: 'Digital Manager',
    message: "Alguien ha trabajado con una agencia que maneje bien Google Ads para el sector logístico? Tenemos un cliente interesado.",
    date: new Date('2023-05-05'),
    intent: 'low',
    status: 'new'
  }
};

const LeadPage = () => {
  const { id } = useParams<{ id: string }>();
  const lead = id ? mockLeads[id] : null;

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-8">
          <Link to="/">
            <Button variant="outline" className="mb-6">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Lead not found</h2>
            <p className="text-muted-foreground">The lead you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8 animate-fade-in">
        <Link to="/">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <LeadDetail lead={lead} />
      </div>
    </div>
  );
};

export default LeadPage;
