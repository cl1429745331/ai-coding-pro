import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 检查环境变量是否存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase环境变量未配置，请检查.env.local文件')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 类型定义
export interface Photo {
  id: string
  title: string
  description?: string
  file_name: string
  file_size?: number
  width?: number
  height?: number
  exif_data?: Record<string, any>
  tags?: string[]
  location?: string
  taken_at?: string
  is_published: boolean
  likes_count: number
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  photo_id: string
  author_name: string
  author_email?: string
  content: string
  is_approved: boolean
  created_at: string
}

export interface Like {
  id: string
  photo_id: string
  user_ip: string
  created_at: string
} 