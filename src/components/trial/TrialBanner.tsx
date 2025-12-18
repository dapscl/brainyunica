import { Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TrialBannerProps {
  daysRemaining: number;
  onUpgrade?: () => void;
}

export const TrialBanner = ({ daysRemaining, onUpgrade }: TrialBannerProps) => {
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/pricing');
    }
  };

  const isUrgent = daysRemaining <= 7;
  
  return (
    <div className={`
      px-4 py-2 flex items-center justify-between gap-4
      ${isUrgent 
        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/30' 
        : 'bg-gradient-to-r from-electric-cyan/10 to-purple-accent/10 border-b border-electric-cyan/20'
      }
    `}>
      <div className="flex items-center gap-3">
        <div className={`
          p-1.5 rounded-full 
          ${isUrgent ? 'bg-orange-500/20' : 'bg-electric-cyan/20'}
        `}>
          {isUrgent ? (
            <Clock className="w-4 h-4 text-orange-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-electric-cyan" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {isUrgent ? (
              <>
                ¡Solo <span className="text-orange-400">{daysRemaining} días</span> restantes de tu trial!
              </>
            ) : (
              <>
                Trial activo: <span className="text-electric-cyan">{daysRemaining} días</span> restantes
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Acceso completo a todos los Brainies durante tu período de prueba
          </p>
        </div>
      </div>
      
      <Button
        onClick={handleUpgrade}
        size="sm"
        className={`
          ${isUrgent 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
            : 'bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90'
          }
          text-white shadow-lg
        `}
      >
        <span className="hidden sm:inline">Elegir Plan</span>
        <span className="sm:hidden">Plan</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
