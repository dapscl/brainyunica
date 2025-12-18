-- Fix profiles table: Add explicit authentication requirement
-- The existing policies check auth.uid() = id, but we should ensure no anonymous access

-- Drop existing SELECT policies and recreate with explicit auth check
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate with explicit authentication requirement
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));

-- Fix leads table: Ensure SELECT is admin-only with explicit auth check
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can manage all leads" ON public.leads;

-- Recreate with explicit authentication for viewing
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));

-- Recreate management policy (UPDATE, DELETE) for admins
CREATE POLICY "Admins can update leads" 
ON public.leads 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads" 
ON public.leads 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'));