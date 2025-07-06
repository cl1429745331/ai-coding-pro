'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PhotoService, TagService } from '../lib/database'
import PhotoCard from '../components/PhotoCard'

interface Photo {
  id: string
  title: string
  description?: string
  thumbnail_url?: string
  image_url: string
  camera_model?: string
  location?: string
  created_at: string
  published_at?: string
  photo_tags?: Array<{
    tags: {
      name: string
      color: string
    }
  }>
  tags?: Array<{
    name: string
    color: string
  }>
}

interface Tag {
  id: string
  name: string
  color: string
  photo_count: number
}

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [activeTag, setActiveTag] = useState("全部")
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // 加载照片数据
  const loadPhotos = async (reset = false) => {
    try {
      setLoading(true)
      const currentPage = reset ? 0 : page
      const limit = 12
      const offset = currentPage * limit

      const { data, error } = await PhotoService.getPublishedPhotos(limit, offset)
      
      if (error) {
        throw new Error(error.message)
      }

      // 转换数据格式，处理标签
      const formattedPhotos = data.map(photo => ({
        ...photo,
        tags: photo.photo_tags?.map((pt: any) => pt.tags).filter((tag: any) => tag && tag.name) || []
      }))

      if (reset) {
        setPhotos(formattedPhotos)
      } else {
        setPhotos(prev => [...prev, ...formattedPhotos])
      }

      setHasMore(data.length === limit)
      setPage(reset ? 1 : currentPage + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载照片失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载标签数据
  const loadTags = async () => {
    try {
      const { data, error } = await TagService.getPopularTags(10)
      
      if (error) {
        throw new Error(error.message)
      }

      setTags(data)
    } catch (err) {
      console.error('加载标签失败:', err)
    }
  }

  // 初始化数据
  useEffect(() => {
    setIsClient(true)
    Promise.all([
      loadPhotos(true),
      loadTags()
    ])
  }, [])

  // 筛选照片
  useEffect(() => {
    if (activeTag === "全部") {
      setFilteredPhotos(photos)
    } else {
                const filtered = photos.filter(photo => 
            photo.tags?.some((tag: any) => tag.name === activeTag)
          )
      setFilteredPhotos(filtered)
    }
  }, [activeTag, photos])

  // 加载更多照片
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPhotos()
    }
  }

  // 处理标签筛选
  const handleTagFilter = async (tagName: string) => {
    setActiveTag(tagName)
    
    if (tagName !== "全部") {
      // 如果选择特定标签，重新从数据库加载该标签的照片
      try {
        setLoading(true)
        const tag = tags.find(t => t.name === tagName)
        if (tag) {
          const { data, error } = await PhotoService.getPhotosByTag(tag.id, 20)
          
          if (error) {
            throw new Error(error.message)
          }

          const formattedPhotos = data.map(photo => ({
            ...photo,
            tags: photo.photo_tags?.map((pt: any) => pt.tags).filter((tag: any) => tag && tag.name) || []
          }))
          
          setFilteredPhotos(formattedPhotos)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '筛选照片失败')
      } finally {
        setLoading(false)
      }
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* 英雄区域 */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="text-center z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 fade-in">
            故事影像馆
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 fade-in" style={{ animationDelay: '0.2s' }}>
            每张照片都有它的故事
          </p>
          <button 
            className="cta-button fade-in"
            style={{ animationDelay: '0.4s' }}
            onClick={() => {
              document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            探索作品
          </button>
        </div>
        
        {/* 背景图片 */}
        <div className="absolute inset-0 -z-10">
          <Image 
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80"
            fill
            className="object-cover opacity-30"
            alt="英雄背景"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
        </div>
      </section>
      
      {/* 标签筛选器 */}
      <section className="sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => handleTagFilter("全部")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTag === "全部"
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              全部
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagFilter(tag.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTag === tag.name
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {tag.name} ({tag.photo_count})
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* 照片展示区域 */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 mb-4">加载失败</p>
              <p className="text-white/60 text-sm mb-4">{error}</p>
              <button 
                onClick={() => {
                  setError(null)
                  loadPhotos(true)
                }}
                className="btn-primary"
              >
                重新加载
              </button>
            </div>
          </div>
        )}

        {!error && filteredPhotos.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">暂无照片</h3>
              <p className="text-white/60">
                {activeTag === "全部" ? "还没有发布任何照片" : `"${activeTag}" 标签下暂无照片`}
              </p>
            </div>
          </div>
        )}

        {filteredPhotos.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </div>
        )}
        
        {/* 加载更多按钮 */}
        {filteredPhotos.length > 0 && activeTag === "全部" && (
          <div className="text-center mt-12">
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/60">加载中...</span>
              </div>
            ) : hasMore ? (
              <button 
                onClick={handleLoadMore}
                className="btn-secondary"
              >
                加载更多作品
              </button>
            ) : (
              <p className="text-white/40">已加载全部作品</p>
            )}
          </div>
        )}
      </section>
      
      {/* 页脚 */}
      <footer className="bg-[#1A1A1A] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">故事影像馆</h3>
          <p className="text-white/60 mb-6">记录生活，分享美好</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              关于我们
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              联系方式
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              隐私政策
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
} 