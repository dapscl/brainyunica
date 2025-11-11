-- Create table for WhatsApp conversations per brand
CREATE TABLE public.whatsapp_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  conversation_state TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for WhatsApp messages
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'text',
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  content TEXT NOT NULL,
  media_url TEXT,
  message_id TEXT,
  status TEXT DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for content suggestions from trends
CREATE TABLE public.content_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  suggestion_type TEXT NOT NULL DEFAULT 'trend',
  title TEXT NOT NULL,
  description TEXT,
  content_draft TEXT,
  source TEXT,
  trend_score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for trend tracking
CREATE TABLE public.trend_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  trend_keyword TEXT NOT NULL,
  trend_score INTEGER NOT NULL,
  category TEXT,
  source TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  tracked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for whatsapp_conversations
CREATE POLICY "Organization members can view conversations"
  ON public.whatsapp_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      JOIN organization_members om ON b.organization_id = om.organization_id
      WHERE b.id = whatsapp_conversations.brand_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization editors can manage conversations"
  ON public.whatsapp_conversations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      JOIN organization_members om ON b.organization_id = om.organization_id
      WHERE b.id = whatsapp_conversations.brand_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'editor')
    )
  );

-- RLS Policies for whatsapp_messages
CREATE POLICY "Organization members can view messages"
  ON public.whatsapp_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM whatsapp_conversations wc
      JOIN brands b ON wc.brand_id = b.id
      JOIN organization_members om ON b.organization_id = om.organization_id
      WHERE wc.id = whatsapp_messages.conversation_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization editors can manage messages"
  ON public.whatsapp_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM whatsapp_conversations wc
      JOIN brands b ON wc.brand_id = b.id
      JOIN organization_members om ON b.organization_id = om.organization_id
      WHERE wc.id = whatsapp_messages.conversation_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'editor')
    )
  );

-- RLS Policies for content_suggestions
CREATE POLICY "Organization members can view suggestions"
  ON public.content_suggestions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      JOIN organization_members om ON b.organization_id = om.organization_id
      WHERE b.id = content_suggestions.brand_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization editors can manage suggestions"
  ON public.content_suggestions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      JOIN organization_members om ON b.organization_id = om.organization_id
      WHERE b.id = content_suggestions.brand_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'editor')
    )
  );

-- RLS Policies for trend_tracking
CREATE POLICY "Organization members can view trends"
  ON public.trend_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = trend_tracking.organization_id
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization editors can manage trends"
  ON public.trend_tracking FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = trend_tracking.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin', 'editor')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_whatsapp_conversations_brand ON public.whatsapp_conversations(brand_id);
CREATE INDEX idx_whatsapp_messages_conversation ON public.whatsapp_messages(conversation_id);
CREATE INDEX idx_content_suggestions_brand ON public.content_suggestions(brand_id);
CREATE INDEX idx_trend_tracking_org ON public.trend_tracking(organization_id);

-- Create trigger for updated_at
CREATE TRIGGER update_whatsapp_conversations_updated_at
  BEFORE UPDATE ON public.whatsapp_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_suggestions_updated_at
  BEFORE UPDATE ON public.content_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();