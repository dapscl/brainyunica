import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Construction, 
  Crown, 
  Rocket, 
  Bell,
  Sparkles
} from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-electric-cyan/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="w-6 h-6 text-yellow-500" />
            Planes Premium
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="text-center"
          >
            {/* Construction Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Construction className="w-12 h-12 text-yellow-500" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
              ¡Próximamente!
            </h3>
            
            <p className="text-muted-foreground mb-6">
              Estamos trabajando en planes premium increíbles para ti.
              Por ahora, disfruta tu trial gratuito de 45 días.
            </p>

            {/* Features Preview */}
            <div className="bg-background/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-electric-cyan" />
                Lo que viene:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-purple-400" />
                  CalendarBrainy - Programación automática
                </li>
                <li className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-cyan-400" />
                  AdBrainy - Optimización de campañas
                </li>
                <li className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-green-400" />
                  ChatBrainy - Automatización WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-orange-400" />
                  TrendBrainy - Detección de tendencias
                </li>
              </ul>
            </div>

            {/* Notify Button */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold"
                onClick={onClose}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notificarme cuando esté listo
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground"
                onClick={onClose}
              >
                Seguir con mi trial
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
