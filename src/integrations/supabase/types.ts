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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_sessions: {
        Row: {
          answers: Json | null
          company: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          current_step: number
          id: string
          industry: string | null
          landing_path: string | null
          last_step_key: string | null
          max_step_reached: number
          referrer: string | null
          report_id: string | null
          session_key: string
          team_size: string | null
          total_steps: number | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          answers?: Json | null
          company?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          industry?: string | null
          landing_path?: string | null
          last_step_key?: string | null
          max_step_reached?: number
          referrer?: string | null
          report_id?: string | null
          session_key: string
          team_size?: string | null
          total_steps?: number | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          answers?: Json | null
          company?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          industry?: string | null
          landing_path?: string | null
          last_step_key?: string | null
          max_step_reached?: number
          referrer?: string | null
          report_id?: string | null
          session_key?: string
          team_size?: string | null
          total_steps?: number | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          access_token: string
          annual_value_cents: number | null
          answers: Json | null
          company: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          currency: string | null
          id: string
          industry: string | null
          paid: boolean
          report: Json | null
          score: number | null
          source: string | null
          stripe_session_id: string | null
          team_size: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          annual_value_cents?: number | null
          answers?: Json | null
          company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          industry?: string | null
          paid?: boolean
          report?: Json | null
          score?: number | null
          source?: string | null
          stripe_session_id?: string | null
          team_size?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          annual_value_cents?: number | null
          answers?: Json | null
          company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          industry?: string | null
          paid?: boolean
          report?: Json | null
          score?: number | null
          source?: string | null
          stripe_session_id?: string | null
          team_size?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount_cents: number | null
          created_at: string
          currency: string | null
          customer_email: string | null
          environment: string
          id: string
          report_id: string | null
          status: string
          stripe_session_id: string
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          environment: string
          id?: string
          report_id?: string | null
          status?: string
          stripe_session_id: string
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          environment?: string
          id?: string
          report_id?: string | null
          status?: string
          stripe_session_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
