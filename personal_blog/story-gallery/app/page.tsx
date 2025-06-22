'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PhotoGrid from '@/components/photo/PhotoGrid'
import { Photo } from '@/lib/supabase'
import { getMockPhotos } from '@/lib/mockData'

export default function Home() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 延迟加载，避免水合错误
    const timer = setTimeout(() => {
      try {
        setLoading(true)
        // 使用模拟数据演示
        const data = getMockPhotos(20, 0)
        setPhotos(data)
      } catch (err) {
        setError('网络错误')
        console.error('Network error:', err)
      } finally {
        setLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handlePhotoClick = (photo: Photo) => {
    router.push(`/photo/${photo.id}`)
  }

  return (
    <div className="min-h-screen bg-dark-500">
      {/* 头部导航 */}
      <header className="bg-dark-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                故事影像馆
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                首页
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                系列
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                关于
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            发现美好瞬间
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            每一张照片都有属于它的故事，让我们一起探索这个世界的美好
          </p>
        </div>

        {/* 照片展示区域 */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-400">正在加载照片...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div className="text-red-400">
              <p className="text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                重新加载
              </button>
            </div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div className="text-gray-400">
              <p className="text-lg">暂无照片</p>
              <p className="text-sm mt-2">期待第一张作品的发布...</p>
            </div>
          </div>
        ) : (
          <PhotoGrid 
            photos={photos} 
            onPhotoClick={handlePhotoClick}
          />
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-dark-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 故事影像馆. 用心记录生活中的美好瞬间.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
