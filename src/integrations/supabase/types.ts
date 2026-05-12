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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      allowed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          notes: string | null
          role: Database["public"]["Enums"]["app_member_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["app_member_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["app_member_role"]
        }
        Relationships: []
      }
      app_versions: {
        Row: {
          latest_version: string
          min_version: string
          platform: string
          store_url: string
          update_message: string
          updated_at: string
        }
        Insert: {
          latest_version: string
          min_version: string
          platform: string
          store_url?: string
          update_message?: string
          updated_at?: string
        }
        Update: {
          latest_version?: string
          min_version?: string
          platform?: string
          store_url?: string
          update_message?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          article_language: string | null
          content: string | null
          id: string
          imageurl: string
          industries: string[] | null
          keywords: string[] | null
          locations: Json | null
          normalized_url: string | null
          publicationdate: string | null
          retrievedat: string | null
          sourceid: string | null
          summary: string | null
          title: string
          url: string
        }
        Insert: {
          article_language?: string | null
          content?: string | null
          id?: string
          imageurl: string
          industries?: string[] | null
          keywords?: string[] | null
          locations?: Json | null
          normalized_url?: string | null
          publicationdate?: string | null
          retrievedat?: string | null
          sourceid?: string | null
          summary?: string | null
          title: string
          url: string
        }
        Update: {
          article_language?: string | null
          content?: string | null
          id?: string
          imageurl?: string
          industries?: string[] | null
          keywords?: string[] | null
          locations?: Json | null
          normalized_url?: string | null
          publicationdate?: string | null
          retrievedat?: string | null
          sourceid?: string | null
          summary?: string | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_sourceid_fkey"
            columns: ["sourceid"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      editorial_configs: {
        Row: {
          created_at: string
          display_name: string | null
          editorial_prompt: string | null
          id: number
          summary_prompt: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          editorial_prompt?: string | null
          id?: number
          summary_prompt?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          editorial_prompt?: string | null
          id?: number
          summary_prompt?: string | null
        }
        Relationships: []
      }
      extraction_runs: {
        Row: {
          articles_inserted: number
          duration_ms: number | null
          error_message: string | null
          id: string
          per_source: Json
          raw_response: Json | null
          ready_sources: number
          retry_sources: number
          run_at: string
          scrapper_status: number | null
          source_type: string
          success: boolean
          total_sources: number
          triggered_by: string
        }
        Insert: {
          articles_inserted?: number
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          per_source?: Json
          raw_response?: Json | null
          ready_sources?: number
          retry_sources?: number
          run_at?: string
          scrapper_status?: number | null
          source_type?: string
          success?: boolean
          total_sources?: number
          triggered_by?: string
        }
        Update: {
          articles_inserted?: number
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          per_source?: Json
          raw_response?: Json | null
          ready_sources?: number
          retry_sources?: number
          run_at?: string
          scrapper_status?: number | null
          source_type?: string
          success?: boolean
          total_sources?: number
          triggered_by?: string
        }
        Relationships: []
      }
      notification_events: {
        Row: {
          created_at: string
          entity_id: string | null
          event_type: string | null
          id: number
          payload: Json | null
          processed: boolean | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          event_type?: string | null
          id?: number
          payload?: Json | null
          processed?: boolean | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          event_type?: string | null
          id?: number
          payload?: Json | null
          processed?: boolean | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          ai_content: string | null
          article_id: string
          content: string
          created_at: string
          id: string
          impersonated_by: string | null
          linkedin_post_url: string | null
          scheduled_for: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_content?: string | null
          article_id: string
          content: string
          created_at?: string
          id?: string
          impersonated_by?: string | null
          linkedin_post_url?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_content?: string | null
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          impersonated_by?: string | null
          linkedin_post_url?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_article_id_fk"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_monthly_points: {
        Row: {
          created_at: string
          period_start: string
          points: number
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          period_start?: string
          points?: number
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          period_start?: string
          points?: number
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_monthly_points_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          consents: Json | null
          created_at: string | null
          current_month_points: number
          display_name: string | null
          id: string
          linkedin_token: string | null
          linkedin_token_expires_at: string | null
          preferences: Json | null
          push_enabled: boolean | null
          updated_at: string | null
          your_thoughts: Json | null
        }
        Insert: {
          avatar_url?: string | null
          consents?: Json | null
          created_at?: string | null
          current_month_points?: number
          display_name?: string | null
          id: string
          linkedin_token?: string | null
          linkedin_token_expires_at?: string | null
          preferences?: Json | null
          push_enabled?: boolean | null
          updated_at?: string | null
          your_thoughts?: Json | null
        }
        Update: {
          avatar_url?: string | null
          consents?: Json | null
          created_at?: string | null
          current_month_points?: number
          display_name?: string | null
          id?: string
          linkedin_token?: string | null
          linkedin_token_expires_at?: string | null
          preferences?: Json | null
          push_enabled?: boolean | null
          updated_at?: string | null
          your_thoughts?: Json | null
        }
        Relationships: []
      }
      sources: {
        Row: {
          apiurl: string
          article_extraction_hints: Json
          article_url_exclude_patterns: Json | null
          article_url_patterns: Json | null
          extraction_limit: number
          id: string
          industries: string[] | null
          language: string | null
          last_inspected_at: string | null
          lastfetched: string | null
          locations: string[] | null
          name: string
          need_filter: boolean | null
          processed: boolean | null
          type: string
          user_id: string | null
        }
        Insert: {
          apiurl: string
          article_extraction_hints?: Json
          article_url_exclude_patterns?: Json | null
          article_url_patterns?: Json | null
          extraction_limit?: number
          id?: string
          industries?: string[] | null
          language?: string | null
          last_inspected_at?: string | null
          lastfetched?: string | null
          locations?: string[] | null
          name: string
          need_filter?: boolean | null
          processed?: boolean | null
          type: string
          user_id?: string | null
        }
        Update: {
          apiurl?: string
          article_extraction_hints?: Json
          article_url_exclude_patterns?: Json | null
          article_url_patterns?: Json | null
          extraction_limit?: number
          id?: string
          industries?: string[] | null
          language?: string | null
          last_inspected_at?: string | null
          lastfetched?: string | null
          locations?: string[] | null
          name?: string
          need_filter?: boolean | null
          processed?: boolean | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      "specialized-extraction": {
        Row: {
          amount: number | null
          created_at: string
          extracted: boolean | null
          id: number
          keywords: string | null
          language: string | null
          lastLink: string | null
          person_id: string | null
          person_name: string | null
          region: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          extracted?: boolean | null
          id?: number
          keywords?: string | null
          language?: string | null
          lastLink?: string | null
          person_id?: string | null
          person_name?: string | null
          region?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          extracted?: boolean | null
          id?: number
          keywords?: string | null
          language?: string | null
          lastLink?: string | null
          person_id?: string | null
          person_name?: string | null
          region?: string | null
        }
        Relationships: []
      }
      user_articles: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          completed_posts: number
          created_at: string
          id: string
          target_posts: number
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          completed_posts?: number
          created_at?: string
          id?: string
          target_posts?: number
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          completed_posts?: number
          created_at?: string
          id?: string
          target_posts?: number
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          event_id: number
          id: number
          profile_id: string
          sent_at: string
          status: string
        }
        Insert: {
          event_id: number
          id?: number
          profile_id: string
          sent_at?: string
          status: string
        }
        Update: {
          event_id?: number
          id?: number
          profile_id?: string
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "notification_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_style_profiles: {
        Row: {
          avoid_phrases: string[]
          confidence: string
          created_at: string
          edit_examples: Json
          identity_snapshot: Json
          last_computed_at: string
          last_post_id: string | null
          learning_loop: Json
          samples_count: number
          signature_phrases: string[]
          style_summary: string | null
          updated_at: string
          user_id: string
          voice_profile: Json
        }
        Insert: {
          avoid_phrases?: string[]
          confidence?: string
          created_at?: string
          edit_examples?: Json
          identity_snapshot?: Json
          last_computed_at?: string
          last_post_id?: string | null
          learning_loop?: Json
          samples_count?: number
          signature_phrases?: string[]
          style_summary?: string | null
          updated_at?: string
          user_id: string
          voice_profile?: Json
        }
        Update: {
          avoid_phrases?: string[]
          confidence?: string
          created_at?: string
          edit_examples?: Json
          identity_snapshot?: Json
          last_computed_at?: string
          last_post_id?: string | null
          learning_loop?: Json
          samples_count?: number
          signature_phrases?: string[]
          style_summary?: string | null
          updated_at?: string
          user_id?: string
          voice_profile?: Json
        }
        Relationships: []
      }
    }
    Views: {
      user_current_points: {
        Row: {
          display_name: string | null
          period_start: string | null
          points: number | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_monthly_points_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_posts_articles: {
        Row: {
          ai_content: string | null
          content: string | null
          display_name: string | null
          imageurl: string | null
          linkedin_post_url: string | null
          publicationdate: string | null
          scheduled_for: string | null
          status: string | null
          summary: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      clear_linkedin_token: { Args: never; Returns: undefined }
      create_publish_posts_cron_job: { Args: never; Returns: string }
      disable_push_notifications: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      enable_push_notifications: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      ensure_user_goal: {
        Args: { user_id_param: string }
        Returns: {
          completed_posts: number
          created_at: string
          id: string
          target_posts: number
          updated_at: string
          user_id: string
          week_start: string
        }
        SetofOptions: {
          from: "*"
          to: "user_goals"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      ensure_user_streak: {
        Args: { user_id_param: string }
        Returns: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_streaks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_all_profiles_for_admin: {
        Args: never
        Returns: {
          avatar_url: string
          display_name: string
          email: string
          id: string
          preferences: Json
        }[]
      }
      get_leaderboard: {
        Args: { top_n?: number }
        Returns: {
          avatar_url: string
          display_name: string
          points: number
          profile_id: string
        }[]
      }
      get_my_linkedin_token_status: {
        Args: never
        Returns: {
          expires_at: string
          has_token: boolean
        }[]
      }
      get_posts_for_admin: {
        Args: { target_user_id: string }
        Returns: {
          ai_content: string | null
          article_id: string
          content: string
          created_at: string
          id: string
          impersonated_by: string | null
          linkedin_post_url: string | null
          scheduled_for: string | null
          status: string
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "posts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_public_profile: {
        Args: { _id: string }
        Returns: {
          avatar_url: string
          current_month_points: number
          display_name: string
          id: string
        }[]
      }
      get_public_profiles: {
        Args: never
        Returns: {
          avatar_url: string
          current_month_points: number
          display_name: string
          id: string
        }[]
      }
      get_push_registration_status: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      get_safe_profile_fields: {
        Args: { profile_row: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: boolean
      }
      get_user_role: {
        Args: { user_email: string }
        Returns: Database["public"]["Enums"]["app_member_role"]
      }
      get_week_start: { Args: { input_date?: string }; Returns: string }
      has_member_role: {
        Args: {
          required_role: Database["public"]["Enums"]["app_member_role"]
          user_email: string
        }
        Returns: boolean
      }
      increment_user_goal_posts: {
        Args: { user_id_param: string }
        Returns: {
          completed_posts: number
          created_at: string
          id: string
          target_posts: number
          updated_at: string
          user_id: string
          week_start: string
        }
        SetofOptions: {
          from: "*"
          to: "user_goals"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      publish_scheduled_posts: { Args: never; Returns: Json }
      save_device_token: {
        Args: { p_platform: string; p_token: string; p_user_id: string }
        Returns: undefined
      }
      schedule_linkedin_token_maintenance: { Args: never; Returns: string }
      schedule_publish_posts_cron: { Args: never; Returns: string }
      set_linkedin_token: {
        Args: { p_expires_at: string; p_token: string }
        Returns: undefined
      }
      setup_cron_extensions: { Args: never; Returns: undefined }
      trigger_daily_streak_checker: { Args: never; Returns: number }
      trigger_delete_old_articles: { Args: never; Returns: undefined }
      trigger_extract_sources: { Args: never; Returns: number }
      trigger_publish_scheduled_posts: { Args: never; Returns: number }
      trigger_specialized_fetch: { Args: never; Returns: undefined }
    }
    Enums: {
      app_member_role: "member" | "admin" | "super_admin"
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
      app_member_role: ["member", "admin", "super_admin"],
    },
  },
} as const
