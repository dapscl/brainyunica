-- Add social media publishing fields to content_items
ALTER TABLE content_items
ADD COLUMN IF NOT EXISTS social_platforms jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS post_text text,
ADD COLUMN IF NOT EXISTS media_urls jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS publish_status text DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;

-- Add check constraint for publish_status
ALTER TABLE content_items
DROP CONSTRAINT IF EXISTS content_items_publish_status_check;

ALTER TABLE content_items
ADD CONSTRAINT content_items_publish_status_check 
CHECK (publish_status IN ('draft', 'scheduled', 'published', 'failed'));

-- Create index for scheduled content queries
CREATE INDEX IF NOT EXISTS idx_content_items_scheduled 
ON content_items(scheduled_date, publish_status) 
WHERE scheduled_date IS NOT NULL;

-- Create index for published content
CREATE INDEX IF NOT EXISTS idx_content_items_published 
ON content_items(published_at DESC) 
WHERE published_at IS NOT NULL;