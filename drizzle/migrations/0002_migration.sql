-- Add explicit RESTRICTIVE policies for subscriptions table
-- Only system administrators can modify subscription data

CREATE POLICY "Only admins can create subscriptions"
ON public.subscriptions
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update subscriptions"
ON public.subscriptions
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete subscriptions"
ON public.subscriptions
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));