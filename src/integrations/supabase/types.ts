export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ad_spend_logs: {
        Row: {
          amount: number
          campaign_id: string | null
          campaign_name: string | null
          channel: string
          created_at: string
          date: string
          id: string
          metadata: Json | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          campaign_name?: string | null
          channel: string
          created_at?: string
          date?: string
          id?: string
          metadata?: Json | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          campaign_name?: string | null
          channel?: string
          created_at?: string
          date?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_spend_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      brand_kits: {
        Row: {
          accent_color: string | null
          brand_guidelines: string | null
          brand_id: string
          color_palette: Json | null
          content_themes: string[] | null
          created_at: string | null
          dos_and_donts: Json | null
          font_source: string | null
          id: string
          instagram_data: Json | null
          instagram_handle: string | null
          learned_keywords: string[] | null
          logo_url: string | null
          logo_variations: Json | null
          posting_patterns: Json | null
          primary_color: string | null
          primary_font_name: string | null
          secondary_color: string | null
          secondary_font_name: string | null
          spacing_scale: Json | null
          style_restrictions: Json | null
          typography: Json | null
          updated_at: string | null
          voice_profile: Json | null
        }
        Insert: {
          accent_color?: string | null
          brand_guidelines?: string | null
          brand_id: string
          color_palette?: Json | null
          content_themes?: string[] | null
          created_at?: string | null
          dos_and_donts?: Json | null
          font_source?: string | null
          id?: string
          instagram_data?: Json | null
          instagram_handle?: string | null
          learned_keywords?: string[] | null
          logo_url?: string | null
          logo_variations?: Json | null
          posting_patterns?: Json | null
          primary_color?: string | null
          primary_font_name?: string | null
          secondary_color?: string | null
          secondary_font_name?: string | null
          spacing_scale?: Json | null
          style_restrictions?: Json | null
          typography?: Json | null
          updated_at?: string | null
          voice_profile?: Json | null
        }
        Update: {
          accent_color?: string | null
          brand_guidelines?: string | null
          brand_id?: string
          color_palette?: Json | null
          content_themes?: string[] | null
          created_at?: string | null
          dos_and_donts?: Json | null
          font_source?: string | null
          id?: string
          instagram_data?: Json | null
          instagram_handle?: string | null
          learned_keywords?: string[] | null
          logo_url?: string | null
          logo_variations?: Json | null
          posting_patterns?: Json | null
          primary_color?: string | null
          primary_font_name?: string | null
          secondary_color?: string | null
          secondary_font_name?: string | null
          spacing_scale?: Json | null
          style_restrictions?: Json | null
          typography?: Json | null
          updated_at?: string | null
          voice_profile?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_kits_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: true
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          organization_id: string
          slug: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          organization_id: string
          slug: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          organization_id?: string
          slug?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_approvals: {
        Row: {
          approved_at: string | null
          approved_by_phone: string | null
          content_item_id: string
          conversation_id: string
          created_at: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["approval_status"]
        }
        Insert: {
          approved_at?: string | null
          approved_by_phone?: string | null
          content_item_id: string
          conversation_id: string
          created_at?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
        }
        Update: {
          approved_at?: string | null
          approved_by_phone?: string | null
          content_item_id?: string
          conversation_id?: string
          created_at?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
        }
        Relationships: [
          {
            foreignKeyName: "content_approvals_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_approvals_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_approvals_legacy: {
        Row: {
          assigned_by: string | null
          comments: string | null
          content_id: string
          created_at: string
          id: string
          reviewed_at: string | null
          reviewer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          comments?: string | null
          content_id: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          comments?: string | null
          content_id?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_approvals_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          brand_id: string
          content: Json | null
          content_type: string
          created_at: string
          created_by: string | null
          id: string
          media_urls: Json | null
          metadata: Json | null
          parent_version_id: string | null
          post_text: string | null
          project_id: string
          publish_status: string | null
          published_at: string | null
          published_date: string | null
          scheduled_date: string | null
          social_platforms: Json | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          brand_id: string
          content?: Json | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          media_urls?: Json | null
          metadata?: Json | null
          parent_version_id?: string | null
          post_text?: string | null
          project_id: string
          publish_status?: string | null
          published_at?: string | null
          published_date?: string | null
          scheduled_date?: string | null
          social_platforms?: Json | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          brand_id?: string
          content?: Json | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          media_urls?: Json | null
          metadata?: Json | null
          parent_version_id?: string | null
          post_text?: string | null
          project_id?: string
          publish_status?: string | null
          published_at?: string | null
          published_date?: string | null
          scheduled_date?: string | null
          social_platforms?: Json | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_items_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      content_suggestions: {
        Row: {
          brand_id: string
          content_draft: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          source: string | null
          status: string
          suggestion_type: string
          title: string
          trend_score: number | null
          updated_at: string
        }
        Insert: {
          brand_id: string
          content_draft?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          status?: string
          suggestion_type?: string
          title: string
          trend_score?: number | null
          updated_at?: string
        }
        Update: {
          brand_id?: string
          content_draft?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          status?: string
          suggestion_type?: string
          title?: string
          trend_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_suggestions_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          organization_id: string
          platform: string | null
          tags: string[] | null
          updated_at: string
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          organization_id: string
          platform?: string | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          organization_id?: string
          platform?: string | null
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "content_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          challenges: string | null
          clients_count: string
          company: string
          created_at: string
          current_tools: string | null
          email: string
          full_name: string
          id: string
          monthly_revenue: string
          phone: string
          suggested_plan: string
          updated_at: string
        }
        Insert: {
          challenges?: string | null
          clients_count: string
          company: string
          created_at?: string
          current_tools?: string | null
          email: string
          full_name: string
          id?: string
          monthly_revenue: string
          phone: string
          suggested_plan: string
          updated_at?: string
        }
        Update: {
          challenges?: string | null
          clients_count?: string
          company?: string
          created_at?: string
          current_tools?: string | null
          email?: string
          full_name?: string
          id?: string
          monthly_revenue?: string
          phone?: string
          suggested_plan?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: number | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          height: number | null
          id: string
          mime_type: string | null
          organization_id: string
          tags: string[] | null
          updated_at: string
          uploaded_by: string
          width: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          height?: number | null
          id?: string
          mime_type?: string | null
          organization_id: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by: string
          width?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          organization_id?: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_library_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          settings: Json | null
          slug: string
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          settings?: Json | null
          slug: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          settings?: Json | null
          slug?: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          limits: Json | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          brand_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id: string
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_tracking: {
        Row: {
          category: string | null
          created_at: string
          id: string
          metadata: Json | null
          organization_id: string
          source: string
          tracked_at: string
          trend_keyword: string
          trend_score: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          organization_id: string
          source: string
          tracked_at?: string
          trend_keyword: string
          trend_score: number
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          source?: string
          tracked_at?: string
          trend_keyword?: string
          trend_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "trend_tracking_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          brand_id: string
          conversation_state: string
          created_at: string
          id: string
          last_message_at: string | null
          metadata: Json | null
          phone_number: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          conversation_state?: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          phone_number: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          conversation_state?: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          phone_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          direction: string
          id: string
          media_url: string | null
          message_id: string | null
          message_type: string
          metadata: Json | null
          status: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          direction: string
          id?: string
          media_url?: string | null
          message_id?: string | null
          message_type?: string
          metadata?: Json | null
          status?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          direction?: string
          id?: string
          media_url?: string | null
          message_id?: string | null
          message_type?: string
          metadata?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ad_spend_metrics: {
        Args: {
          _end_date?: string
          _organization_id: string
          _start_date?: string
        }
        Returns: {
          campaign_performance: Json
          channel_breakdown: Json
          daily_spend: Json
          total_spend: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_organization_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_organization_owner: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      log_audit: {
        Args: {
          p_action: string
          p_entity_id: string
          p_entity_type: string
          p_new_values?: Json
          p_old_values?: Json
          p_user_id: string
        }
        Returns: undefined
      }
      send_notification: {
        Args: {
          p_entity_id?: string
          p_entity_type?: string
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "client" | "collaborator"
      approval_status: "pending" | "approved" | "rejected"
      whatsapp_direction: "incoming" | "outgoing" | "system"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client", "collaborator"],
      approval_status: ["pending", "approved", "rejected"],
      whatsapp_direction: ["incoming", "outgoing", "system"],
    },
  },
} as const
