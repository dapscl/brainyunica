import { motion } from 'framer-motion';
import { Calendar, MessageSquare, TrendingUp, Bot, Sparkles, Clock, DollarSign, Target, Zap, CheckCircle, Activity, BarChart3, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 bg-electric-cyan rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

// Loading spinner component
const LoadingSpinner = ({ color = "electric-cyan" }: { color?: string }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="inline-block"
  >
    <Loader2 className={`w-3 h-3 text-${color}`} />
  </motion.div>
);

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface CardZone {
  name: string;
  x: number;
  y: number;
  color: string;
}

export const AnimatedHero = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Define card zones (approximate positions in percentage)
  const cardZones: CardZone[] = [
    { name: 'whatsapp', x: 15, y: 15, color: 'hsl(var(--electric-cyan))' },
    { name: 'calendar', x: 85, y: 15, color: 'hsl(280 70% 60%)' },
    { name: 'adbrain', x: 15, y: 85, color: 'hsl(140 70% 50%)' },
    { name: 'chatbrain', x: 85, y: 85, color: 'hsl(280 70% 60%)' },
  ];

  // Check if particle is near any card
  const getNearbyCard = (p: Particle): CardZone | null => {
    for (const card of cardZones) {
      const distance = Math.sqrt(
        Math.pow(p.x - card.x, 2) + Math.pow(p.y - card.y, 2)
      );
      if (distance < 20) return card;
    }
    return null;
  };

  useEffect(() => {
    // Generate initial particles
    const initialParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }));
    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;
          let newVx = p.vx;
          let newVy = p.vy;

          // Bounce off edges
          if (newX < 0 || newX > 100) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY < 0 || newY > 100) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(100, newY));
          }

          return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate connections between nearby particles
  const connections = particles.flatMap((p1, i) =>
    particles.slice(i + 1).map((p2, j) => {
      const distance = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );
      return distance < 15 ? { p1, p2, opacity: 1 - distance / 15 } : null;
    }).filter(Boolean)
  ).filter((conn): conn is { p1: Particle; p2: Particle; opacity: number } => conn !== null);

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-deep-blue to-background rounded-2xl overflow-hidden border border-electric-cyan/20 shadow-glow-blue">
      {/* Particle Background */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Connections */}
        {connections.map((conn, i) => (
          <line
            key={`line-${i}`}
            x1={`${conn.p1.x}%`}
            y1={`${conn.p1.y}%`}
            x2={`${conn.p2.x}%`}
            y2={`${conn.p2.y}%`}
            stroke="hsl(var(--electric-cyan))"
            strokeWidth="1"
            opacity={conn.opacity * 0.3}
          />
        ))}
        
        {/* Card Zone Connections */}
        {particles.map(p => {
          const nearbyCard = getNearbyCard(p);
          if (!nearbyCard) return null;
          
          const distance = Math.sqrt(
            Math.pow(p.x - nearbyCard.x, 2) + Math.pow(p.y - nearbyCard.y, 2)
          );
          const opacity = 1 - distance / 20;
          
          return (
            <line
              key={`card-line-${p.id}`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${nearbyCard.x}%`}
              y2={`${nearbyCard.y}%`}
              stroke={nearbyCard.color}
              strokeWidth="2"
              opacity={opacity * 0.6}
              className="animate-pulse"
            />
          );
        })}
        
        {/* Particles */}
        {particles.map(p => {
          const nearbyCard = getNearbyCard(p);
          const isNearCard = nearbyCard !== null;
          
          return (
            <g key={`particle-${p.id}`}>
              {isNearCard && (
                <>
                  {/* Outer glow ring */}
                  <circle
                    cx={`${p.x}%`}
                    cy={`${p.y}%`}
                    r="6"
                    fill="none"
                    stroke={nearbyCard.color}
                    strokeWidth="1"
                    opacity="0.4"
                    className="animate-pulse"
                  />
                  {/* Middle glow ring */}
                  <circle
                    cx={`${p.x}%`}
                    cy={`${p.y}%`}
                    r="4"
                    fill="none"
                    stroke={nearbyCard.color}
                    strokeWidth="1"
                    opacity="0.6"
                    className="animate-pulse"
                    style={{ animationDelay: '0.15s' }}
                  />
                </>
              )}
              {/* Main particle */}
              <circle
                cx={`${p.x}%`}
                cy={`${p.y}%`}
                r={isNearCard ? "3" : "2"}
                fill={isNearCard ? nearbyCard.color : "hsl(var(--electric-cyan))"}
                opacity={isNearCard ? "0.9" : "0.6"}
                className={isNearCard ? "animate-pulse" : ""}
              />
            </g>
          );
        })}
        
        {/* Card Zone Markers */}
        {cardZones.map(zone => (
          <circle
            key={`zone-${zone.name}`}
            cx={`${zone.x}%`}
            cy={`${zone.y}%`}
            r="3"
            fill={zone.color}
            opacity="0.3"
            className="animate-pulse"
          />
        ))}
      </svg>

      {/* Simulated Interface Elements */}
      <div className="absolute inset-0 p-8 z-10">
        {/* Chat Bubble Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute top-8 left-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 max-w-xs border border-electric-cyan/30 shadow-glow-cyan"
        >
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-electric-cyan" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-electric-cyan mb-1">WhatsApp Manager</p>
              <p className="text-xs text-muted-foreground mb-2">Contenido listo para aprobación ✅</p>
              <div className="flex items-center gap-2 text-xs text-electric-cyan/60">
                <span>Procesando respuesta</span>
                <TypingIndicator />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute top-8 right-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs font-semibold text-purple-500">CalendarBrainy™</p>
              <p className="text-xs text-muted-foreground mt-1">12 posts programados</p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute bottom-8 left-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-green-500/30"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-green-500">AdBrainy™</p>
                <Loader2 className="w-3 h-3 text-green-500 animate-spin" />
              </div>
              <p className="text-lg font-bold text-foreground mb-2">+47% ROAS</p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Optimizando campaña...</p>
                <div className="w-full bg-background/50 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatDelay: 8 }}
                  />
                </div>
                <p className="text-xs text-green-500">78% completado</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Bot Animation */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 6, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute bottom-8 right-8 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs font-semibold text-purple-500 mb-1">ChatBrainy™</p>
              <p className="text-xs text-muted-foreground mb-2">89 leads capturados</p>
              <div className="flex items-center gap-2 text-xs text-purple-500/60">
                <span>Respondiendo</span>
                <TypingIndicator />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CreatorBrainy Notification */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute top-1/3 right-16 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-electric-cyan/40 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-electric-cyan animate-pulse" />
            <p className="text-xs font-medium text-electric-cyan">CreatorBrainy™</p>
            <Loader2 className="w-3 h-3 text-electric-cyan animate-spin" />
          </div>
          <p className="text-xs text-foreground mb-2">3 variantes creadas</p>
          <div className="space-y-1">
            <div className="w-full bg-background/50 rounded-full h-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-electric-cyan to-electric-cyan/80"
                initial={{ width: "0%" }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity, repeatDelay: 8 }}
              />
            </div>
            <p className="text-xs text-electric-cyan/80">Generando variante 3/3</p>
          </div>
        </motion.div>

        {/* TrendBrainy Alert */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute top-1/2 left-1/4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <p className="text-xs font-medium text-foreground">Nueva tendencia detectada</p>
            <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
          </div>
        </motion.div>

        {/* Budget Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 5, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute top-1/2 right-1/4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-green-500/40"
        >
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
            <div>
              <p className="text-xs font-medium text-foreground">$2.5K optimizado</p>
              <p className="text-xs text-green-500">Calculando ROI...</p>
            </div>
          </div>
        </motion.div>

        {/* Campaign Status */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2.5, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute bottom-1/3 left-16 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-500/40"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-xs font-medium text-foreground">Campaña activa</p>
          </div>
        </motion.div>

        {/* Sync Indicator */}
        <motion.div
          initial={{ opacity: 0, rotate: 10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 4.5, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute bottom-1/2 left-1/3 bg-card/90 backdrop-blur-sm rounded-full px-3 py-2 border border-electric-cyan/40"
        >
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-electric-cyan animate-pulse" />
            <p className="text-xs font-medium text-electric-cyan">Sync</p>
          </div>
        </motion.div>

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 6.5, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute bottom-1/4 right-1/3 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
            <p className="text-xs font-medium text-foreground">127 interacciones</p>
            <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
          </div>
        </motion.div>

        {/* Content Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 7.5, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute top-2/3 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-electric-cyan/40"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-electric-cyan" />
            <p className="text-xs font-medium text-foreground">Publicando en 2h</p>
          </div>
        </motion.div>

        {/* Performance Badge */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.5, repeat: Infinity, repeatDelay: 8, repeatType: "reverse" }}
          className="absolute top-1/4 right-1/3 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/50"
        >
          <div className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-green-500" />
            <p className="text-xs font-bold text-green-500">↑ 34%</p>
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
