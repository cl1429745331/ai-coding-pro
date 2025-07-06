import { createClient } from '@supabase/supabase-js'

// 检查环境变量是否存在
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  }
})

// 导出环境变量供其他组件使用
export const config = {
  supabaseUrl,
  supabaseAnonKey,
  appName: process.env.NEXT_PUBLIC_APP_NAME || '故事影像馆',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '每张照片都有它的故事',
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'), // 10MB
  allowedFileTypes: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'],
  imageQuality: parseInt(process.env.NEXT_PUBLIC_IMAGE_QUALITY || '80'),
  thumbnailWidth: parseInt(process.env.NEXT_PUBLIC_THUMBNAIL_WIDTH || '400'),
  thumbnailHeight: parseInt(process.env.NEXT_PUBLIC_THUMBNAIL_HEIGHT || '600')
}

// 数据库类型定义（可选，但建议使用）
export interface Database {
  public: {
    Tables: {
      photos: {
        Row: {
          id: string
          title: string
          description: string | null
          story: string | null
          category: string | null
          image_url: string
          thumbnail_url: string | null
          file_name: string
          file_size: number | null
          width: number | null
          height: number | null
          camera_model: string | null
          lens: string | null
          aperture: string | null
          shutter_speed: string | null
          iso: number | null
          focal_length: number | null
          location: string | null
          taken_at: string | null
          is_published: boolean
          view_count: number
          like_count: number
          comment_count: number
          sort_order: number
          featured: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          story?: string | null
          category?: string | null
          image_url: string
          thumbnail_url?: string | null
          file_name: string
          file_size?: number | null
          width?: number | null
          height?: number | null
          camera_model?: string | null
          lens?: string | null
          aperture?: string | null
          shutter_speed?: string | null
          iso?: number | null
          focal_length?: number | null
          location?: string | null
          taken_at?: string | null
          is_published?: boolean
          view_count?: number
          like_count?: number
          comment_count?: number
          sort_order?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          story?: string | null
          category?: string | null
          image_url?: string
          thumbnail_url?: string | null
          file_name?: string
          file_size?: number | null
          width?: number | null
          height?: number | null
          camera_model?: string | null
          lens?: string | null
          aperture?: string | null
          shutter_speed?: string | null
          iso?: number | null
          focal_length?: number | null
          location?: string | null
          taken_at?: string | null
          is_published?: boolean
          view_count?: number
          like_count?: number
          comment_count?: number
          sort_order?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
    }
  }
} 