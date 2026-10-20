import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const scopeLabel = (s: string) =>
  s === "openid" ? "Confirmar tu identidad" :
  s === "email" ? "Compartir tu correo" :
  s === "profile" ? "Compartir tu perfil básico" :
  `Permiso adicional: ${s}`;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!authorizationId) return setError("Falta el identificador de autorización.");
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          const next = window.location.pathname + window.location.search;
          window.location.href = "/auth?next=" + encodeURIComponent(next);
          return;
        }
        setEmail(sess.session.user.email ?? null);
        const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) return setError(error.message);
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) { window.location.href = immediate; return; }
        setDetails(data);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Error inesperado");
      }
    })();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve
        ? await oauth().approveAuthorization(authorizationId)
        : await oauth().denyAuthorization(authorizationId);
      if (error) { setBusy(false); return setError(error.message); }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) { setBusy(false); return setError("El servidor no devolvió una dirección de retorno."); }
      window.location.href = target;
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Error inesperado");
    }
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "una app";
  const scopes: string[] = String(details?.scope ?? details?.scopes ?? "openid email profile")
    .split(/[\s,]+/).filter(Boolean);

  return (
    <main className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {error ? "No pudimos cargar la solicitud" : details ? `Conectar ${clientName} a Brainy` : "Cargando…"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {error && <p className="text-destructive">{error}</p>}
          {details && !error && (
            <>
              <p>{clientName} podrá usar las herramientas de Brainy en tu nombre.</p>
              {email && <p className="text-muted-foreground">Cuenta: {email}</p>}
              {details?.redirect_uri && (
                <p className="text-muted-foreground break-all">Destino: {details.redirect_uri}</p>
              )}
              <ul className="list-disc pl-5 space-y-1">
                {scopes.map((s) => <li key={s}>{scopeLabel(s)}</li>)}
              </ul>
              <p className="text-muted-foreground">Esto no salta los permisos de tu cuenta en Brainy.</p>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>Aprobar</Button>
                <Button className="flex-1" variant="outline" disabled={busy} onClick={() => decide(false)}>Cancelar conexión</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
