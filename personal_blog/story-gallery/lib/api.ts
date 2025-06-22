import { supabase, Photo } from './supabase'

// 获取已发布的照片列表
export async function getPublishedPhotos(
  limit: number = 20,
  offset: number = 0
): Promise<{ data: Photo[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return { data: data || [], error }
  } catch (error) {
    console.error('获取照片失败:', error)
    return { data: [], error }
  }
}

// 获取单张照片详情
export async function getPhotoById(id: string): Promise<{ data: Photo | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    return { data, error }
  } catch (error) {
    console.error('获取照片详情失败:', error)
    return { data: null, error }
  }
}

// 增加照片浏览次数
export async function incrementPhotoViews(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.rpc('increment_photo_views', { photo_id: id })
    return { error }
  } catch (error) {
    console.error('更新浏览次数失败:', error)
    return { error }
  }
}

// 获取热门照片
export async function getPopularPhotos(limit: number = 10): Promise<{ data: Photo[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('is_published', true)
      .order('likes_count', { ascending: false })
      .limit(limit)

    return { data: data || [], error }
  } catch (error) {
    console.error('获取热门照片失败:', error)
    return { data: [], error }
  }
}

// 根据标签筛选照片
export async function getPhotosByTag(tag: string, limit: number = 20): Promise<{ data: Photo[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('is_published', true)
      .contains('tags', [tag])
      .order('published_at', { ascending: false })
      .limit(limit)

    return { data: data || [], error }
  } catch (error) {
    console.error('按标签获取照片失败:', error)
    return { data: [], error }
  }
} 