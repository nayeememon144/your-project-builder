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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      departments: {
        Row: {
          code: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          description_bn: string | null
          display_order: number | null
          established_year: number | null
          faculty_id: string | null
          head_id: string | null
          id: string
          is_active: boolean | null
          mission: string | null
          name: string
          name_bn: string | null
          office_location: string | null
          short_name: string | null
          updated_at: string
          vision: string | null
          website_url: string | null
        }
        Insert: {
          code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          display_order?: number | null
          established_year?: number | null
          faculty_id?: string | null
          head_id?: string | null
          id?: string
          is_active?: boolean | null
          mission?: string | null
          name: string
          name_bn?: string | null
          office_location?: string | null
          short_name?: string | null
          updated_at?: string
          vision?: string | null
          website_url?: string | null
        }
        Update: {
          code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          display_order?: number | null
          established_year?: number | null
          faculty_id?: string | null
          head_id?: string | null
          id?: string
          is_active?: boolean | null
          mission?: string | null
          name?: string
          name_bn?: string | null
          office_location?: string | null
          short_name?: string | null
          updated_at?: string
          vision?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attachments: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          description_bn: string | null
          end_date: string | null
          event_date: string
          featured_image: string | null
          id: string
          is_featured: boolean | null
          organizer: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          title_bn: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_bn?: string | null
          end_date?: string | null
          event_date: string
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          organizer?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          title_bn?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_bn?: string | null
          end_date?: string | null
          event_date?: string
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          organizer?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          title_bn?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          description_bn: string | null
          display_order: number | null
          featured_image: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          name_bn: string | null
          operating_hours: string | null
          short_name: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          display_order?: number | null
          featured_image?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          name_bn?: string | null
          operating_hours?: string | null
          short_name?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          display_order?: number | null
          featured_image?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          name_bn?: string | null
          operating_hours?: string | null
          short_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faculties: {
        Row: {
          created_at: string
          dean_id: string | null
          description: string | null
          description_bn: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          name_bn: string | null
          short_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dean_id?: string | null
          description?: string | null
          description_bn?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          name_bn?: string | null
          short_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dean_id?: string | null
          description?: string | null
          description_bn?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_bn?: string | null
          short_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          title: string
          title_bn: string | null
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title: string
          title_bn?: string | null
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title?: string
          title_bn?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          album_id: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          thumbnail_url: string | null
          title: string | null
        }
        Insert: {
          album_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          thumbnail_url?: string | null
          title?: string | null
        }
        Update: {
          album_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          thumbnail_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_slides: {
        Row: {
          created_at: string
          cta_link: string | null
          cta_text: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          subtitle: string | null
          subtitle_bn: string | null
          title: string
          title_bn: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          subtitle?: string | null
          subtitle_bn?: string | null
          title: string
          title_bn?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          subtitle?: string | null
          subtitle_bn?: string | null
          title?: string
          title_bn?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string | null
          content: string
          content_bn: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          title: string
          title_bn: string | null
          updated_at: string
          views: number | null
        }
        Insert: {
          category?: string | null
          content: string
          content_bn?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title: string
          title_bn?: string | null
          updated_at?: string
          views?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          content_bn?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title?: string
          title_bn?: string | null
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      notice_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_bn: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_bn?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_bn?: string | null
          slug?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          attachments: Json | null
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string
          description_bn: string | null
          expires_at: string | null
          id: string
          is_featured: boolean | null
          is_pinned: boolean | null
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          target_audience: string[] | null
          title: string
          title_bn: string | null
          updated_at: string
          views: number | null
        }
        Insert: {
          attachments?: Json | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          description_bn?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          target_audience?: string[] | null
          title: string
          title_bn?: string | null
          updated_at?: string
          views?: number | null
        }
        Update: {
          attachments?: Json | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          description_bn?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          target_audience?: string[] | null
          title?: string
          title_bn?: string | null
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notices_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "notice_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_background: string | null
          areas_of_interest: string[] | null
          batch: string | null
          created_at: string
          department_id: string | null
          designation: string | null
          email: string | null
          employee_id: string | null
          faculty_id: string | null
          full_name: string
          full_name_bn: string | null
          google_scholar_url: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login: string | null
          orcid_url: string | null
          phone: string | null
          professional_experience: string | null
          profile_photo: string | null
          program_id: string | null
          researchgate_url: string | null
          semester: number | null
          session: string | null
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_background?: string | null
          areas_of_interest?: string[] | null
          batch?: string | null
          created_at?: string
          department_id?: string | null
          designation?: string | null
          email?: string | null
          employee_id?: string | null
          faculty_id?: string | null
          full_name: string
          full_name_bn?: string | null
          google_scholar_url?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          orcid_url?: string | null
          phone?: string | null
          professional_experience?: string | null
          profile_photo?: string | null
          program_id?: string | null
          researchgate_url?: string | null
          semester?: number | null
          session?: string | null
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_background?: string | null
          areas_of_interest?: string[] | null
          batch?: string | null
          created_at?: string
          department_id?: string | null
          designation?: string | null
          email?: string | null
          employee_id?: string | null
          faculty_id?: string | null
          full_name?: string
          full_name_bn?: string | null
          google_scholar_url?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          orcid_url?: string | null
          phone?: string | null
          professional_experience?: string | null
          profile_photo?: string | null
          program_id?: string | null
          researchgate_url?: string | null
          semester?: number | null
          session?: string | null
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          admission_requirements: string | null
          career_opportunities: string | null
          created_at: string
          degree_type: string
          department_id: string | null
          description: string | null
          duration_years: number | null
          id: string
          is_active: boolean | null
          name: string
          name_bn: string | null
          total_credits: number | null
          updated_at: string
        }
        Insert: {
          admission_requirements?: string | null
          career_opportunities?: string | null
          created_at?: string
          degree_type?: string
          department_id?: string | null
          description?: string | null
          duration_years?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          name_bn?: string | null
          total_credits?: number | null
          updated_at?: string
        }
        Update: {
          admission_requirements?: string | null
          career_opportunities?: string | null
          created_at?: string
          degree_type?: string
          department_id?: string | null
          description?: string | null
          duration_years?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_bn?: string | null
          total_credits?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_stats: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          label: string
          label_bn: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          label_bn?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          label_bn?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      research_papers: {
        Row: {
          abstract: string | null
          approved_at: string | null
          authors: string[]
          citation_count: number | null
          created_at: string
          department_id: string | null
          doi_link: string | null
          google_scholar_link: string | null
          id: string
          impact_factor: number | null
          indexed_in: string[] | null
          is_corresponding_author: boolean | null
          issue: string | null
          journal_conference_name: string | null
          keywords: string[] | null
          pages: string | null
          pdf_url: string | null
          publication_date: string | null
          publication_type:
            | Database["public"]["Enums"]["publication_type"]
            | null
          publisher: string | null
          pubmed_link: string | null
          research_areas: string[] | null
          researchgate_link: string | null
          review_notes: string | null
          reviewed_by: string | null
          scopus_link: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          submitted_at: string | null
          teacher_id: string
          title: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          approved_at?: string | null
          authors: string[]
          citation_count?: number | null
          created_at?: string
          department_id?: string | null
          doi_link?: string | null
          google_scholar_link?: string | null
          id?: string
          impact_factor?: number | null
          indexed_in?: string[] | null
          is_corresponding_author?: boolean | null
          issue?: string | null
          journal_conference_name?: string | null
          keywords?: string[] | null
          pages?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          publication_type?:
            | Database["public"]["Enums"]["publication_type"]
            | null
          publisher?: string | null
          pubmed_link?: string | null
          research_areas?: string[] | null
          researchgate_link?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          scopus_link?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          submitted_at?: string | null
          teacher_id: string
          title: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          approved_at?: string | null
          authors?: string[]
          citation_count?: number | null
          created_at?: string
          department_id?: string | null
          doi_link?: string | null
          google_scholar_link?: string | null
          id?: string
          impact_factor?: number | null
          indexed_in?: string[] | null
          is_corresponding_author?: boolean | null
          issue?: string | null
          journal_conference_name?: string | null
          keywords?: string[] | null
          pages?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          publication_type?:
            | Database["public"]["Enums"]["publication_type"]
            | null
          publisher?: string | null
          pubmed_link?: string | null
          research_areas?: string[] | null
          researchgate_link?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          scopus_link?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          submitted_at?: string | null
          teacher_id?: string
          title?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_papers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_student: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student"
      content_status: "draft" | "pending" | "published" | "archived"
      publication_type:
        | "journal"
        | "conference"
        | "book_chapter"
        | "patent"
        | "other"
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
      app_role: ["admin", "teacher", "student"],
      content_status: ["draft", "pending", "published", "archived"],
      publication_type: [
        "journal",
        "conference",
        "book_chapter",
        "patent",
        "other",
      ],
    },
  },
} as const
