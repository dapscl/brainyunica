-- Create table for export history
CREATE TABLE public.export_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  title TEXT,
  brand_name TEXT,
  hashtags TEXT[],
  format TEXT NOT NULL,
  exported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own export history
CREATE POLICY "Users can view their own export history"
ON public.export_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own export history
CREATE POLICY "Users can insert their own export history"
ON public.export_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own export history
CREATE POLICY "Users can delete their own export history"
ON public.export_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_export_history_user_id ON public.export_history(user_id);
CREATE INDEX idx_export_history_exported_at ON public.export_history(exported_at DESC);