// Types du schéma Supabase (supabase/migrations). Format compatible avec `supabase gen types typescript` :
// à régénérer ou à mettre à jour à chaque nouvelle migration.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Difficulte = 'facile' | 'moyen' | 'difficile';
export type Creneau = 'midi' | 'soir';
export type SourceArticle = 'planning' | 'manuel';
export type PreferenceThemeProfil = 'clair' | 'sombre' | 'systeme';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          locale: 'fr' | 'en';
          theme: PreferenceThemeProfil;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          locale?: 'fr' | 'en';
          theme?: PreferenceThemeProfil;
        };
        Update: {
          display_name?: string;
          locale?: 'fr' | 'en';
          theme?: PreferenceThemeProfil;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string;
          servings: number;
          prep_minutes: number;
          cook_minutes: number;
          difficulty: Difficulte;
          tags: string[];
          ingredients: Json;
          steps: Json;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string;
          servings?: number;
          prep_minutes?: number;
          cook_minutes?: number;
          difficulty?: Difficulte;
          tags?: string[];
          ingredients?: Json;
          steps?: Json;
          image_url?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          servings?: number;
          prep_minutes?: number;
          cook_minutes?: number;
          difficulty?: Difficulte;
          tags?: string[];
          ingredients?: Json;
          steps?: Json;
          image_url?: string | null;
        };
        Relationships: [];
      };
      meal_plan_entries: {
        Row: {
          id: string;
          user_id: string;
          plan_date: string;
          slot: Creneau;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          plan_date: string;
          slot: Creneau;
          recipe_id: string;
        };
        Update: {
          plan_date?: string;
          slot?: Creneau;
          recipe_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'meal_plan_entries_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          },
        ];
      };
      shopping_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: number | null;
          unit: string;
          checked: boolean;
          source: SourceArticle;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          quantity?: number | null;
          unit?: string;
          checked?: boolean;
          source?: SourceArticle;
        };
        Update: {
          name?: string;
          quantity?: number | null;
          unit?: string;
          checked?: boolean;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

export type Ligne<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Insertion<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type MiseAJour<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
