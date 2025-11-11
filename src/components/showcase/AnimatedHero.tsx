import { motion } from 'framer-motion';
import { Calendar, MessageSquare, TrendingUp, Bot } from 'lucide-react';

export const AnimatedHero = () => {
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-deep-blue to-background rounded-2xl overflow-hidden border border-electric-cyan/20 shadow-glow-blue">
      {/* Simulated Interface Elements */}
      <div className="absolute inset-0 p-8">
        {/* Chat Bubble Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 4 }}
          className="absolute top-8 left-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 max-w-xs border border-electric-cyan/30 shadow-glow-cyan"
        >
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-electric-cyan" />
            <div>
              <p className="text-xs font-semibold text-electric-cyan mb-1">WhatsApp Manager</p>
              <p className="text-xs text-muted-foreground">Contenido listo para aprobación ✅</p>
            </div>
          </div>
        </motion.div>

        {/* Calendar Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatDelay: 4 }}
          className="absolute top-8 right-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs font-semibold text-purple-500">CalendarBrain™</p>
              <p className="text-xs text-muted-foreground mt-1">12 posts programados</p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3, repeat: Infinity, repeatDelay: 4 }}
          className="absolute bottom-8 left-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-green-500/30"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs font-semibold text-green-500">AdBrain™</p>
              <p className="text-lg font-bold text-foreground mt-1">+47% ROAS</p>
            </div>
          </div>
        </motion.div>

        {/* AI Bot Animation */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 4.5, repeat: Infinity, repeatDelay: 4 }}
          className="absolute bottom-8 right-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-500 animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-purple-500">ChatBrain™</p>
              <p className="text-xs text-muted-foreground mt-1">89 leads capturados</p>
            </div>
          </div>
        </motion.div>

        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glow Effect */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-cyan/20 rounded-full blur-3xl"
        ></motion.div>
      </div>
    </div>
  );
};
