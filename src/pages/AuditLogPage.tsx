import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Package, Building2 } from "lucide-react";

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "organizations":
      return <Building2 className="h-4 w-4" />;
    case "brands":
      return <Package className="h-4 w-4" />;
    case "projects":
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "create":
      return "default";
    case "update":
      return "secondary";
    case "delete":
      return "destructive";
    default:
      return "outline";
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case "create":
      return "Creado";
    case "update":
      return "Actualizado";
    case "delete":
      return "Eliminado";
    default:
      return action;
  }
};

export default function AuditLogPage() {
  const { logs, loading } = useAuditLog();

  return (
    <>
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Registro de Auditoría</h1>
          <p className="text-muted-foreground mt-2">
            Historial completo de cambios en el sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay registros de auditoría
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-1">{getEntityIcon(log.entity_type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getActionColor(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                        <span className="font-medium">{log.entity_type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.new_values?.name || log.old_values?.name || "Sin nombre"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(log.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
