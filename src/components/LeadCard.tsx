
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export interface Lead {
  id: string;
  name: string;
  company: string;
  position: string;
  message: string;
  avatar?: string;
  date: Date;
  intent: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

interface LeadCardProps {
  lead: Lead;
}

const intentColors = {
  high: "bg-intent-high/10 text-intent-high border-intent-high/20",
  medium: "bg-intent-medium/10 text-intent-medium border-intent-medium/20",
  low: "bg-intent-low/10 text-intent-low border-intent-low/20"
};

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed"
};

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            {lead.avatar ? (
              <AvatarImage src={lead.avatar} alt={lead.name} />
            ) : (
              <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <Link to={`/lead/${lead.id}`} className="inline-block">
              <h3 className="font-semibold hover:text-primary">{lead.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{lead.position} at {lead.company}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className={`${intentColors[lead.intent]} text-xs`}>
                {lead.intent.charAt(0).toUpperCase() + lead.intent.slice(1)} Intent
              </Badge>
              <Badge variant="outline" className="text-xs">
                {statusLabels[lead.status]}
              </Badge>
            </div>
            <p className="text-sm mt-3 text-gray-700">{lead.message}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-4 py-2">
        <div className="flex justify-between w-full items-center">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(lead.date, { addSuffix: true })}
          </span>
          <Link 
            to={`/lead/${lead.id}`}
            className="text-xs text-primary hover:underline"
          >
            View details →
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;
