-- Actualizar políticas RLS de brands para permitir a admins y editors gestionar marcas

-- Drop política anterior que solo permitía a owners
DROP POLICY IF EXISTS "Organization owners can manage brands" ON public.brands;

-- Permitir a owners, admins y editors insertar marcas
CREATE POLICY "Organization members can create brands"
ON public.brands
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = brands.organization_id
      AND om.user_id = auth.uid()
      AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'editor'::text])
  )
);

-- Permitir a owners, admins y editors actualizar marcas
CREATE POLICY "Organization members can update brands"
ON public.brands
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = brands.organization_id
      AND om.user_id = auth.uid()
      AND om.role = ANY (ARRAY['owner'::text, 'admin'::text, 'editor'::text])
  )
);

-- Permitir solo a owners y admins eliminar marcas
CREATE POLICY "Organization admins can delete brands"
ON public.brands
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = brands.organization_id
      AND om.user_id = auth.uid()
      AND om.role = ANY (ARRAY['owner'::text, 'admin'::text])
  )
);