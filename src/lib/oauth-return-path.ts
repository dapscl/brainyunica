export function oauthReturnPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(value)) return "/";
  const origin = "https://app.invalid";
  try {
    const target = new URL(value, origin);
    if (target.origin !== origin || target.pathname.startsWith("//")) return "/";
    return target.pathname + target.search + target.hash;
  } catch {
    return "/";
  }
}

const KEY = "brainy_oauth_next";

/** Remember a validated return path (e.g. OAuth consent) across login redirects. */
export function rememberNext(raw: string | null) {
  if (!raw) return;
  const path = oauthReturnPath(raw);
  if (path !== "/") sessionStorage.setItem(KEY, path);
}

/** Take and clear the remembered return path, if any. */
export function consumeNext(): string | null {
  const v = sessionStorage.getItem(KEY);
  if (!v) return null;
  sessionStorage.removeItem(KEY);
  const path = oauthReturnPath(v);
  return path === "/" ? null : path;
}
