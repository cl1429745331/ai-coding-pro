import { supabase } from './supabase'

// 照片相关操作
export class PhotoService {
  // 获取已发布的照片列表
  static async getPublishedPhotos(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        photo_tags (
          tag_id,
          tags (
            id,
            name,
            color
          )
        )
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching photos:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }

  // 根据分类获取照片
  static async getPhotosByCategory(category: string, limit = 20) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching photos by category:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }

  // 根据标签获取照片
  static async getPhotosByTag(tagId: string, limit = 20) {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        photo_tags!inner (
          tag_id
        )
      `)
      .eq('photo_tags.tag_id', tagId)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching photos by tag:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }

  // 获取单张照片详情
  static async getPhotoById(id: string) {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        photo_tags (
          tag_id,
          tags (
            id,
            name,
            color
          )
        ),
        comments (
          id,
          author_name,
          content,
          created_at
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching photo:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  // 增加照片浏览量
  static async incrementViewCount(id: string) {
    // 首先获取当前浏览量
    const { data: photo } = await supabase
      .from('photos')
      .select('view_count')
      .eq('id', id)
      .single()

    if (photo) {
      const { error } = await supabase
        .from('photos')
        .update({ view_count: (photo.view_count || 0) + 1 })
        .eq('id', id)

      if (error) {
        console.error('Error incrementing view count:', error)
      }
    }
  }

  // 获取热门照片
  static async getPopularPhotos(limit = 10) {
    const { data, error } = await supabase
      .from('popular_photos')
      .select('*')
      .limit(limit)

    if (error) {
      console.error('Error fetching popular photos:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }

  // 搜索照片
  static async searchPhotos(query: string, limit = 20) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,story.ilike.%${query}%`)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error searching photos:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }
}

// 标签相关操作
export class TagService {
  // 获取所有标签
  static async getAllTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('photo_count', { ascending: false })

    if (error) {
      console.error('Error fetching tags:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }

  // 获取热门标签
  static async getPopularTags(limit = 10) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .gt('photo_count', 0)
      .order('photo_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular tags:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }
}

// 分类相关操作
export class CategoryService {
  // 获取所有分类
  static async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }
}

// 评论相关操作
export class CommentService {
  // 获取照片评论
  static async getPhotoComments(photoId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('photo_id', photoId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }

  // 添加评论
  static async addComment(photoId: string, authorName: string, content: string, authorEmail?: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        photo_id: photoId,
        author_name: authorName,
        author_email: authorEmail,
        content: content,
        is_approved: false // 需要审核
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }
}

// 点赞相关操作
export class LikeService {
  // 点赞照片
  static async likePhoto(photoId: string, ipAddress: string) {
    const { data, error } = await supabase
      .from('likes')
      .insert({
        photo_id: photoId,
        ip_address: ipAddress
      })
      .select()
      .single()

    if (error) {
      console.error('Error liking photo:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  // 取消点赞
  static async unlikePhoto(photoId: string, ipAddress: string) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('photo_id', photoId)
      .eq('ip_address', ipAddress)

    if (error) {
      console.error('Error unliking photo:', error)
      return { error }
    }

    return { error: null }
  }

  // 检查是否已点赞
  static async checkLikeStatus(photoId: string, ipAddress: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('photo_id', photoId)
      .eq('ip_address', ipAddress)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking like status:', error)
      return { liked: false, error }
    }

    return { liked: !!data, error: null }
  }
}

// 系列相关操作
export class SeriesService {
  // 获取所有系列
  static async getAllSeries() {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching series:', error)
      return { data: [], error }
    }

    return { data, error: null }
  }

  // 获取系列详情及照片
  static async getSeriesWithPhotos(seriesId: string) {
    const { data, error } = await supabase
      .from('series')
      .select(`
        *,
        photo_series (
          sort_order,
          photos (
            id,
            title,
            thumbnail_url,
            image_url
          )
        )
      `)
      .eq('id', seriesId)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching series with photos:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }
} 