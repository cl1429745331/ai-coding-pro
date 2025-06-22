'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Photo } from '@/lib/supabase'
import { getMockPhotoById } from '@/lib/mockData'
import { ArrowLeft, Heart, Share2, MapPin, Camera } from 'lucide-react'

export default function PhotoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPhoto() {
      if (!params.id) return

      try {
        setLoading(true)
        // 使用模拟数据演示
        const data = getMockPhotoById(params.id as string)
        
        if (!data) {
          setError('照片不存在')
        } else {
          setPhoto(data)
        }
      } catch (err) {
        setError('加载失败')
      } finally {
        setLoading(false)
      }
    }

    loadPhoto()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">正在加载...</p>
        </div>
      </div>
    )
  }

  if (error || !photo) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">照片不存在</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-500">
      {/* 导航栏 */}
      <header className="bg-dark-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-300 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回
            </button>
            <h1 className="text-xl font-semibold text-white truncate">
              {photo.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主图展示 */}
          <div className="lg:col-span-2">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <Image
                src={`https://picsum.photos/seed/${photo.id}/${photo.width || 800}/${photo.height || 600}`}
                alt={photo.title}
                width={photo.width || 800}
                height={photo.height || 600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* 信息面板 */}
          <div className="space-y-6">
            {/* 基础信息 */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{photo.title}</h1>
              {photo.description && (
                <p className="text-gray-300 text-lg leading-relaxed">
                  {photo.description}
                </p>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Heart className="w-4 h-4 mr-2" />
                {photo.likes_count}
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </button>
            </div>

            {/* 拍摄信息 */}
            {(photo.exif_data || photo.location || photo.taken_at) && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  拍摄信息
                </h3>
                <div className="space-y-3 text-sm">
                  {photo.taken_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">拍摄时间:</span>
                      <span className="text-white">
                        {new Date(photo.taken_at).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  {photo.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-white">{photo.location}</span>
                    </div>
                  )}
                  {photo.exif_data && (
                    <>
                      {photo.exif_data.camera && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">相机:</span>
                          <span className="text-white">{photo.exif_data.camera}</span>
                        </div>
                      )}
                      {photo.exif_data.lens && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">镜头:</span>
                          <span className="text-white">{photo.exif_data.lens}</span>
                        </div>
                      )}
                      {photo.exif_data.aperture && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">光圈:</span>
                          <span className="text-white">f/{photo.exif_data.aperture}</span>
                        </div>
                      )}
                      {photo.exif_data.shutter_speed && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">快门:</span>
                          <span className="text-white">{photo.exif_data.shutter_speed}s</span>
                        </div>
                      )}
                      {photo.exif_data.iso && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">ISO:</span>
                          <span className="text-white">{photo.exif_data.iso}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 标签 */}
            {photo.tags && photo.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 