import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, TrendingUp, Brain } from 'lucide-react';

interface Analysis {
  strengths?: string[];
  improvements?: string[];
  opportunities?: string[];
}

interface JulianKoenigVersion {
  hook?: string;
  body?: string;
  cta?: string;
  fullCopy?: string;
  content?: string;
  variant?: string;
  bigIdea?: string;
  headline?: string;
  philosophy?: string;
}

interface AnalysisDisplayProps {
  analysis?: Analysis;
  julianKoenigVersion?: JulianKoenigVersion;
}

const AnalysisDisplay = ({ analysis, julianKoenigVersion }: AnalysisDisplayProps) => {
  if (!analysis && !julianKoenigVersion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4 mt-6"
    >
      {/* Julian Koenig Version */}
      {julianKoenigVersion && (
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4" />
              Versión Julian Koenig
              <span className="text-xs font-normal text-amber-400/70">– El legendario copywriter de "Think Small"</span>
            </h4>
            
            {julianKoenigVersion.fullCopy && (
              <div className="mb-3">
                <p className="text-sm text-foreground italic bg-background/30 p-3 rounded-lg border border-amber-500/20">
                  "{julianKoenigVersion.fullCopy}"
                </p>
              </div>
            )}
            
            {julianKoenigVersion.content && !julianKoenigVersion.fullCopy && (
              <div className="mb-3">
                <p className="text-sm text-foreground italic bg-background/30 p-3 rounded-lg border border-amber-500/20">
                  "{julianKoenigVersion.content}"
                </p>
              </div>
            )}

            {julianKoenigVersion.variant && (
              <div className="mb-3">
                <p className="text-sm text-foreground italic bg-background/30 p-3 rounded-lg border border-amber-500/20">
                  "{julianKoenigVersion.variant}"
                </p>
              </div>
            )}

            {julianKoenigVersion.bigIdea && (
              <div className="mb-2">
                <span className="text-xs font-medium text-amber-400">Gran Idea: </span>
                <span className="text-sm text-foreground">{julianKoenigVersion.bigIdea}</span>
              </div>
            )}

            {julianKoenigVersion.headline && (
              <div className="mb-2">
                <span className="text-xs font-medium text-amber-400">Titular: </span>
                <span className="text-sm text-foreground font-semibold">"{julianKoenigVersion.headline}"</span>
              </div>
            )}

            {julianKoenigVersion.hook && !julianKoenigVersion.fullCopy && (
              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-xs font-medium text-amber-400">Hook: </span>
                  <span className="text-sm text-foreground">{julianKoenigVersion.hook}</span>
                </div>
                {julianKoenigVersion.body && (
                  <div>
                    <span className="text-xs font-medium text-amber-400">Cuerpo: </span>
                    <span className="text-sm text-foreground">{julianKoenigVersion.body}</span>
                  </div>
                )}
                {julianKoenigVersion.cta && (
                  <div>
                    <span className="text-xs font-medium text-amber-400">CTA: </span>
                    <span className="text-sm text-foreground">{julianKoenigVersion.cta}</span>
                  </div>
                )}
              </div>
            )}

            {julianKoenigVersion.philosophy && (
              <p className="text-xs text-muted-foreground mt-3 italic border-t border-amber-500/20 pt-3">
                💡 <strong>Filosofía:</strong> {julianKoenigVersion.philosophy}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Section */}
      {analysis && (
        <Card className="bg-card/30 border-border/50">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-foreground mb-4">Análisis del Contenido</h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h5 className="text-xs font-semibold text-green-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Fortalezas
                  </h5>
                  <ul className="space-y-1.5">
                    {analysis.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-green-400 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <h5 className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Áreas de Mejora
                  </h5>
                  <ul className="space-y-1.5">
                    {analysis.improvements.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-yellow-400 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Opportunities */}
              {analysis.opportunities && analysis.opportunities.length > 0 && (
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <h5 className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Oportunidades
                  </h5>
                  <ul className="space-y-1.5">
                    {analysis.opportunities.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AnalysisDisplay;
