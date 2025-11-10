-- Corregir todas las funciones sin search_path
CREATE OR REPLACE FUNCTION public.log_audit(p_user_id uuid, p_action text, p_entity_type text, p_entity_id uuid, p_old_values jsonb DEFAULT NULL::jsonb, p_new_values jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_old_values, p_new_values);
END;
$$;

CREATE OR REPLACE FUNCTION public.send_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'info'::text, p_entity_type text DEFAULT NULL::text, p_entity_id uuid DEFAULT NULL::uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, entity_type, entity_id)
  VALUES (p_user_id, p_title, p_message, p_type, p_entity_type, p_entity_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_old_values jsonb;
  v_new_values jsonb;
  v_action text;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_old_values := to_jsonb(OLD);
    v_new_values := NULL;
    v_action := 'delete';
    PERFORM log_audit(auth.uid(), v_action, TG_TABLE_NAME, OLD.id, v_old_values, v_new_values);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_old_values := to_jsonb(OLD);
    v_new_values := to_jsonb(NEW);
    v_action := 'update';
    PERFORM log_audit(auth.uid(), v_action, TG_TABLE_NAME, NEW.id, v_old_values, v_new_values);
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    v_old_values := NULL;
    v_new_values := to_jsonb(NEW);
    v_action := 'create';
    PERFORM log_audit(auth.uid(), v_action, TG_TABLE_NAME, NEW.id, v_old_values, v_new_values);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;