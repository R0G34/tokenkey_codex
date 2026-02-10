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
    PostgrestVersion: '12.2.2 (db9da0b)'
  }
  public: {
    Tables: {
      bank_account: {
        Row: {
          bank: string
          created_at: string
          currency: string
          holder: string
          iban: string
          is_default: boolean
          location: string
          status: string | null
          swift: string
          updated_at: string
          user_id: string
          verification_amount: number
        }
        Insert: {
          bank: string
          created_at?: string
          currency: string
          holder: string
          iban: string
          is_default: boolean
          location: string
          status?: string | null
          swift: string
          updated_at?: string
          user_id: string
          verification_amount: number
        }
        Update: {
          bank?: string
          created_at?: string
          currency?: string
          holder?: string
          iban?: string
          is_default?: boolean
          location?: string
          status?: string | null
          swift?: string
          updated_at?: string
          user_id?: string
          verification_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: 'bank_account_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      company: {
        Row: {
          beneficial_owners: Json | null
          city: string
          country: string
          created_at: string
          founding_date: string
          legal_form: string
          name: string
          postcode: string
          registry_court: string | null
          registry_no: string | null
          registry_number: string
          representatives: Json | null
          street: string
          street_number: string
          tax_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          beneficial_owners?: Json | null
          city: string
          country: string
          created_at?: string
          founding_date: string
          legal_form: string
          name: string
          postcode: string
          registry_court?: string | null
          registry_no?: string | null
          registry_number: string
          representatives?: Json | null
          street: string
          street_number: string
          tax_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          beneficial_owners?: Json | null
          city?: string
          country?: string
          created_at?: string
          founding_date?: string
          legal_form?: string
          name?: string
          postcode?: string
          registry_court?: string | null
          registry_no?: string | null
          registry_number?: string
          representatives?: Json | null
          street?: string
          street_number?: string
          tax_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'company_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      concedus_ident_link: {
        Row: {
          action_id: string
          created_at: string
          kyc: string
          status: string
          transaction_id: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          action_id: string
          created_at?: string
          kyc: string
          status: string
          transaction_id?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          action_id?: string
          created_at?: string
          kyc?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'concedus_ident_link_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      concedus_webhook: {
        Row: {
          created_at: string
          event: Json
          id: number
          retries: number
          status: string
          topic: string
        }
        Insert: {
          created_at?: string
          event: Json
          id?: number
          retries?: number
          status?: string
          topic: string
        }
        Update: {
          created_at?: string
          event?: Json
          id?: number
          retries?: number
          status?: string
          topic?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          consent: string | null
          created_at: string
          knowledge: Json | null
          professional: Json | null
          risk_consent: boolean | null
          score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent?: string | null
          created_at?: string
          knowledge?: Json | null
          professional?: Json | null
          risk_consent?: boolean | null
          score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent?: string | null
          created_at?: string
          knowledge?: Json | null
          professional?: Json | null
          risk_consent?: boolean | null
          score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'experience_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      message: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: number
          preview: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: number
          preview: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: number
          preview?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'message_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      optin: {
        Row: {
          amount: number
          created_at: string
          id: number
          nyala_optin_id: string | null
          project_id: number
          token_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          nyala_optin_id?: string | null
          project_id: number
          token_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          nyala_optin_id?: string | null
          project_id?: number
          token_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'optin_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'optin_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      order: {
        Row: {
          compliance_status: string | null
          created_at: string
          id: number
          optin_id: number | null
          payment_reference: string
          payment_status: string | null
          project_id: number
          token_price: number
          token_quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          compliance_status?: string | null
          created_at?: string
          id?: number
          optin_id?: number | null
          payment_reference: string
          payment_status?: string | null
          project_id: number
          token_price: number
          token_quantity: number
          updated_at?: string
          user_id: string
        }
        Update: {
          compliance_status?: string | null
          created_at?: string
          id?: number
          optin_id?: number | null
          payment_reference?: string
          payment_status?: string | null
          project_id?: number
          token_price?: number
          token_quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_optin_id_fkey'
            columns: ['optin_id']
            isOneToOne: false
            referencedRelation: 'optin'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      payment: {
        Row: {
          amount: number
          created_at: string
          id: number
          optin_id: number
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          optin_id: number
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          optin_id?: number
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payment_optin_id_fkey'
            columns: ['optin_id']
            isOneToOne: false
            referencedRelation: 'optin'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payment_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      personal_data: {
        Row: {
          birthdate: string
          birthplace: string
          city: string
          country: string
          created_at: string
          forename: string
          gender: number | null
          kyc: boolean
          nationality: string
          nyala_customer_id: string | null
          pep: boolean | null
          phone_number: string | null
          postcode: string
          roles: Json | null
          salutation: string | null
          street: string
          street_number: string
          surname: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birthdate: string
          birthplace: string
          city: string
          country: string
          created_at?: string
          forename: string
          gender?: number | null
          kyc?: boolean
          nationality: string
          nyala_customer_id?: string | null
          pep?: boolean | null
          phone_number?: string | null
          postcode: string
          roles?: Json | null
          salutation?: string | null
          street: string
          street_number: string
          surname: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birthdate?: string
          birthplace?: string
          city?: string
          country?: string
          created_at?: string
          forename?: string
          gender?: number | null
          kyc?: boolean
          nationality?: string
          nyala_customer_id?: string | null
          pep?: boolean | null
          phone_number?: string | null
          postcode?: string
          roles?: Json | null
          salutation?: string | null
          street?: string
          street_number?: string
          surname?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'personal_data_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      project: {
        Row: {
          code: string
          concedus_project_product_name: string | null
          created_at: string
          id: number
          lat: number
          lng: number
          modality: string
          nyala_project_id: string | null
          nyala_tokenized_asset_id: string | null
          profitability: number
          secupay_contract_id: string | null
          status: string
          term: number
          token_price: number
          total_amount: number
          total_token: number
          type: string
          updated_at: string
        }
        Insert: {
          code: string
          concedus_project_product_name?: string | null
          created_at?: string
          id?: number
          lat: number
          lng: number
          modality: string
          nyala_project_id?: string | null
          nyala_tokenized_asset_id?: string | null
          profitability: number
          secupay_contract_id?: string | null
          status: string
          term: number
          token_price: number
          total_amount: number
          total_token: number
          type: string
          updated_at?: string
        }
        Update: {
          code?: string
          concedus_project_product_name?: string | null
          created_at?: string
          id?: number
          lat?: number
          lng?: number
          modality?: string
          nyala_project_id?: string | null
          nyala_tokenized_asset_id?: string | null
          profitability?: number
          secupay_contract_id?: string | null
          status?: string
          term?: number
          token_price?: number
          total_amount?: number
          total_token?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_document: {
        Row: {
          created_at: string
          filename: string
          id: number
          key: string
          project_id: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          filename: string
          id?: number
          key: string
          project_id: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          filename?: string
          id?: number
          key?: string
          project_id?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_document_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
        ]
      }
      project_image: {
        Row: {
          cover: boolean
          created_at: string
          id: number
          key: string
          project_id: number
          rank: number | null
          updated_at: string
          url: string
        }
        Insert: {
          cover?: boolean
          created_at?: string
          id?: number
          key: string
          project_id: number
          rank?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          cover?: boolean
          created_at?: string
          id?: number
          key?: string
          project_id?: number
          rank?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_image_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
        ]
      }
      project_translation: {
        Row: {
          city: string
          country: string
          created_at: string
          description: string
          id: number
          locale: string
          location_description: string
          name: string
          project_id: number
          state: string
          updated_at: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          description: string
          id?: number
          locale: string
          location_description: string
          name: string
          project_id: number
          state: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          description?: string
          id?: number
          locale?: string
          location_description?: string
          name?: string
          project_id?: number
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_translation_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
        ]
      }
      secupay_smart_transaction: {
        Row: {
          created_at: string
          id: string
          order_id: number
          responses: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          order_id: number
          responses: Json
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: number
          responses?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'secupay_smart_transaction_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'order'
            referencedColumns: ['id']
          },
        ]
      }
      secupay_webhook: {
        Row: {
          created: string
          created_at: string
          data: Json
          id: string
          object: string
          status: string
          target: string
          type: string
        }
        Insert: {
          created: string
          created_at?: string
          data: Json
          id: string
          object: string
          status?: string
          target: string
          type: string
        }
        Update: {
          created?: string
          created_at?: string
          data?: Json
          id?: string
          object?: string
          status?: string
          target?: string
          type?: string
        }
        Relationships: []
      }
      transaction: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: number
          method: string
          reference: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: number
          method: string
          reference?: string | null
          status: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: number
          method?: string
          reference?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transaction_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      user: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          locale: string
          name: string | null
          type: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          locale?: string
          name?: string | null
          type?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          locale?: string
          name?: string | null
          type?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      wallet: {
        Row: {
          address: string
          created_at: string
          nyala_external_retail_wallet_id: string | null
          type: string
          updated_at: string
          user_id: string
          web3auth_user_info: Json | null
        }
        Insert: {
          address: string
          created_at?: string
          nyala_external_retail_wallet_id?: string | null
          type: string
          updated_at?: string
          user_id: string
          web3auth_user_info?: Json | null
        }
        Update: {
          address?: string
          created_at?: string
          nyala_external_retail_wallet_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          web3auth_user_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'wallet_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      project_optin_summary: {
        Row: {
          project_id: number | null
          tokens: number | null
          users: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'optin_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
        ]
      }
      user_funds: {
        Row: {
          balance: number | null
          deposit_completed: number | null
          deposit_pending: number | null
          deposit_pending_count: number | null
          invested: number | null
          user_id: string | null
          withdrawal_completed: number | null
          withdrawal_pending: number | null
          withdrawal_pending_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'transaction_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      user_optin_summary: {
        Row: {
          invested_current_month: number | null
          invested_previous_month: number | null
          invested_total: number | null
          projects: number | null
          tokens: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'optin_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
