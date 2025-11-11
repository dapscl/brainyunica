import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Users, Filter, Download, Mail, Phone, MapPin, Briefcase, Tag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ShowcaseLeadCapturePage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Mock leads data
  const leads = [
    {
      id: 1,
      name: 'Ana García',
      email: 'ana.garcia@email.com',
      phone: '+34 600 123 456',
      source: 'Facebook',
      status: 'hot',
      tags: ['Producto Premium', 'Contactado'],
      location: 'Madrid, España',
      company: 'Tech Solutions SL',
      capturedAt: '2025-11-10'
    },
    {
      id: 2,
      name: 'Carlos Mendez',
      email: 'carlos.m@empresa.com',
      phone: '+34 600 789 012',
      source: 'Instagram',
      status: 'warm',
      tags: ['Interesado', 'Newsletter'],
      location: 'Barcelona, España',
      company: 'Marketing Pro',
      capturedAt: '2025-11-09'
    },
    {
      id: 3,
      name: 'Laura Fernández',
      email: 'laura.f@startup.io',
      phone: '+34 600 345 678',
      source: 'LinkedIn',
      status: 'cold',
      tags: ['Demo Solicitada'],
      location: 'Valencia, España',
      company: 'StartupHub',
      capturedAt: '2025-11-08'
    }
  ];

  const stats = [
    { label: 'Total Leads', value: '1,243', change: '+12%', icon: Users },
    { label: 'Leads Calientes', value: '87', change: '+8%', icon: Users },
    { label: 'Tasa de Conversión', value: '34%', change: '+3%', icon: Users },
    { label: 'Fuentes Activas', value: '6', change: '0%', icon: Users }
  ];

  const segments = [
    { name: 'Producto Premium', count: 145, color: 'bg-purple-500' },
    { name: 'Newsletter', count: 432, color: 'bg-blue-500' },
    { name: 'Demo Solicitada', count: 78, color: 'bg-green-500' },
    { name: 'Interesado', count: 234, color: 'bg-yellow-500' },
    { name: 'Contactado', count: 354, color: 'bg-red-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-yellow-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hot': return 'Caliente';
      case 'warm': return 'Templado';
      case 'cold': return 'Frío';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/showcase/brands/${slug}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Captura de Leads</h1>
              <p className="text-muted-foreground mt-1">
                Sistema de captura, segmentación y gestión de leads
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Lead
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>{stat.label}</CardDescription>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input placeholder="Buscar leads..." className="flex-1" />
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leads Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Leads Recientes</CardTitle>
                <CardDescription>{leads.length} leads encontrados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{lead.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`} />
                          <Badge variant="outline" className="text-xs">
                            {getStatusLabel(lead.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3 h-3" />
                            <span>{lead.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{lead.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant="secondary">
                        {lead.source}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      Capturado: {lead.capturedAt}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Segmentos</CardTitle>
                <CardDescription>Organiza tus leads por categorías</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {segments.map((segment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                      <span className="text-sm font-medium">{segment.name}</span>
                    </div>
                    <Badge variant="secondary">{segment.count}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Segmento
                </Button>
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fuentes de Leads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Facebook</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '65%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Instagram</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '45%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">LinkedIn</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '30%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Website</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '20%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  Enviar Email Masivo
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Tag className="w-4 h-4" />
                  Aplicar Tags
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="w-4 h-4" />
                  Exportar Seleccionados
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseLeadCapturePage;
