-- Create storage buckets for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-logos', 'organization-logos', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true);

-- RLS Policies for organization-logos bucket
CREATE POLICY "Organization logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'organization-logos');

CREATE POLICY "Authenticated users can upload organization logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'organization-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update organization logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'organization-logos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete organization logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'organization-logos'
  AND auth.role() = 'authenticated'
);

-- RLS Policies for brand-logos bucket
CREATE POLICY "Brand logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');

CREATE POLICY "Authenticated users can upload brand logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update brand logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'brand-logos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete brand logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brand-logos'
  AND auth.role() = 'authenticated'
);