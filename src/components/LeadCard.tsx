
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';

export interface Lead {
  id: string;
  name: string;
  company: string;
  position: string;
  message: string;
  date: Date;
  intent: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  avatar?: string;
  country?: string;
  email?: string;
  emailVerified?: boolean;
  lastContactDate?: Date;
}

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'high':
        return 'bg-intent-high/10 text-intent-high border-intent-high/20';
      case 'medium':
        return 'bg-intent-medium/10 text-intent-medium border-intent-medium/20';
      case 'low':
        return 'bg-intent-low/10 text-intent-low border-intent-low/20';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return '';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {lead.avatar ? (
              <img 
                src={lead.avatar} 
                alt={lead.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{lead.name}</h3>
              <Badge variant="outline" className={`${getIntentColor(lead.intent)}`}>
                {lead.intent === 'high' ? 'Alta' : lead.intent === 'medium' ? 'Media' : 'Baja'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {lead.position} at {lead.company}
            </p>
            {lead.country && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="mr-1">📍</span> 
                {lead.country === 'es' ? 'España' :
                 lead.country === 'mx' ? 'México' :
                 lead.country === 'co' ? 'Colombia' :
                 lead.country === 'ar' ? 'Argentina' :
                 lead.country === 'cl' ? 'Chile' :
                 lead.country === 'pe' ? 'Perú' : 'Otro país'}
              </div>
            )}
            <div className="mt-3">
              <p className="text-sm line-clamp-2">{lead.message}</p>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className={`${getStatusColor(lead.status)}`}>
                {lead.status === 'new' ? 'Nuevo' : 
                 lead.status === 'contacted' ? 'Contactado' : 
                 lead.status === 'qualified' ? 'Calificado' : 'Cerrado'}
              </Badge>
              
              {lead.emailVerified && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Email Verificado
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <div className="text-xs text-muted-foreground">
          {new Date(lead.date).toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8 px-2">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Link to={`/lead/${lead.id}`}>
            <Button size="sm" variant="outline" className="h-8">
              Ver detalle
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;
