# AGENTS.md

- Backend is Lovable Cloud; build edge function URLs from `import.meta.env.VITE_SUPABASE_PROJECT_ID` or use `supabase.functions.invoke`, never a hardcoded project ref — the backend was swapped once and hardcoded refs broke.
- `supabase/migrations/` holds the legacy schema history; the live schema was re-applied via the migration tool (additively, with GRANTs), so treat the database itself as the source of truth.
- Storage buckets are private (workspace blocks public buckets); serve files via signed URLs.
