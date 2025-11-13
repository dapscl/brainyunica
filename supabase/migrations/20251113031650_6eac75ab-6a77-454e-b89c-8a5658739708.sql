-- Add unique constraint to email column in leads table
ALTER TABLE public.leads ADD CONSTRAINT leads_email_unique UNIQUE (email);