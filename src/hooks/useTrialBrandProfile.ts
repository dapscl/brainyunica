import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrialBrandProfile {
  id?: string;
  user_id?: string;
  brand_name: string;
  brand_handle?: string;
  brand_type?: string;
  tone: string;
  style: string;
  colors: string[];
  keywords: string[];
  personality: string;
  analysis?: any;
  logo_url?: string;
  description?: string;
  connected_ads?: string[];
  connected_social?: string[];
}

export const useTrialBrandProfile = () => {
  const [brandProfile, setBrandProfile] = useState<TrialBrandProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return null;
      }

      const { data, error } = await supabase
        .from('trial_brand_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading brand profile:', error);
      }

      if (data) {
        const profile: TrialBrandProfile = {
          id: data.id,
          user_id: data.user_id,
          brand_name: data.brand_name,
          brand_handle: data.brand_handle,
          brand_type: data.brand_type,
          tone: data.tone,
          style: data.style,
          colors: Array.isArray(data.colors) ? (data.colors as string[]) : [],
          keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
          personality: data.personality || '',
          analysis: data.analysis,
          logo_url: data.logo_url || '',
          description: data.description || '',
          connected_ads: Array.isArray(data.connected_ads) ? (data.connected_ads as string[]) : [],
          connected_social: Array.isArray(data.connected_social) ? (data.connected_social as string[]) : [],
        };
        setBrandProfile(profile);
        return profile;
      }
      
      setLoading(false);
      return null;
    } catch (error) {
      console.error('Error in loadProfile:', error);
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profile: Omit<TrialBrandProfile, 'id' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('trial_brand_profiles')
        .upsert({
          user_id: user.id,
          brand_name: profile.brand_name,
          brand_handle: profile.brand_handle,
          brand_type: profile.brand_type,
          tone: profile.tone,
          style: profile.style,
          colors: profile.colors,
          keywords: profile.keywords,
          personality: profile.personality,
          analysis: profile.analysis || {},
          logo_url: profile.logo_url,
          description: profile.description,
          connected_ads: profile.connected_ads || [],
          connected_social: profile.connected_social || [],
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const savedProfile: TrialBrandProfile = {
          id: data.id,
          user_id: data.user_id,
          brand_name: data.brand_name,
          brand_handle: data.brand_handle,
          brand_type: data.brand_type,
          tone: data.tone,
          style: data.style,
          colors: Array.isArray(data.colors) ? (data.colors as string[]) : [],
          keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
          personality: data.personality || '',
          analysis: data.analysis,
          logo_url: data.logo_url || '',
          description: data.description || '',
          connected_ads: Array.isArray(data.connected_ads) ? (data.connected_ads as string[]) : [],
          connected_social: Array.isArray(data.connected_social) ? (data.connected_social as string[]) : [],
        };
        setBrandProfile(savedProfile);
        return savedProfile;
      }
      return null;
    } catch (error) {
      console.error('Error saving brand profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { brandProfile, loading, loadProfile, saveProfile };
};
