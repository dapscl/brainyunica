-- Permitir que usuarios autenticados creen sus propias organizaciones
DROP POLICY IF EXISTS "Admins can manage their organization" ON public.organizations;

CREATE POLICY "Users can create their own organization"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can manage their organization"
ON public.organizations
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their organization"
ON public.organizations
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Actualizar política de brands para permitir creación
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;

CREATE POLICY "Organization owners can manage brands"
ON public.brands
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM organizations
    WHERE organizations.id = brands.organization_id
    AND organizations.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organizations
    WHERE organizations.id = brands.organization_id
    AND organizations.owner_id = auth.uid()
  )
);