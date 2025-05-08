
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface LeadFiltersProps {
  onFilterChange: (filters: LeadFilters) => void;
}

export interface LeadFilters {
  search?: string;
  intent?: 'high' | 'medium' | 'low' | 'all';
  country?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'closed' | 'all';
}

const countries = [
  { value: 'all', label: 'Todos los países' },
  { value: 'es', label: 'España' },
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'pe', label: 'Perú' },
  { value: 'other', label: 'Otros países' }
];

const LeadFilters: React.FC<LeadFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<LeadFilters>({
    search: '',
    intent: 'all',
    country: 'all',
    status: 'all'
  });

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    const newFilters = { 
      ...filters, 
      [key]: value as any // Cast para corregir el error de tipo
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: LeadFilters = {
      search: '',
      intent: 'all',
      country: 'all',
      status: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar leads..." 
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div>
          <Select
            value={filters.intent}
            onValueChange={(value) => handleFilterChange('intent', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nivel de intención" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              <SelectItem value="high">Alta intención</SelectItem>
              <SelectItem value="medium">Media intención</SelectItem>
              <SelectItem value="low">Baja intención</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select 
            value={filters.country}
            onValueChange={(value) => handleFilterChange('country', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="País de origen" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select 
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="new">Nuevo</SelectItem>
              <SelectItem value="contacted">Contactado</SelectItem>
              <SelectItem value="qualified">Calificado</SelectItem>
              <SelectItem value="closed">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button variant="outline" size="sm" onClick={resetFilters} className="mr-2">
          Limpiar filtros
        </Button>
        <Button size="sm" className="gap-1">
          <Filter className="h-4 w-4" /> Aplicar filtros
        </Button>
      </div>
    </div>
  );
};

export default LeadFilters;
