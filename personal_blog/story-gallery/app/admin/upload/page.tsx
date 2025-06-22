'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, ArrowLeft, CheckCircle, X } from 'lucide-react'
import PhotoUpload from '@/components/admin/PhotoUpload'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

interface PhotoUploadData {
  file: File
  preview: string
  title: string
  description: string
  location: string
  tags: string[]
  taken_at: string
  is_published: boolean
}

const UploadPage = () => {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)

  const handleUpload = async (photos: PhotoUploadData[]) => {
    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      
      // 添加文件
      photos.forEach(photo => {
        formData.append('files', photo.file)
      })

      // 添加照片信息
      const photoData = photos.map(photo => ({
        title: photo.title,
        description: photo.description,
        location: photo.location,
        tags: photo.tags,
        taken_at: photo.taken_at,
        is_published: photo.is_published
      }))
      
      formData.append('data', JSON.stringify(photoData))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setUploadResult({
          success: true,
          message: result.message,
          count: result.photos.length
        })
        
        // 3秒后返回管理页面
        setTimeout(() => {
          router.push('/admin')
        }, 3000)
      } else {
        setUploadResult({
          success: false,
          message: result.error || '上传失败'
        })
      }
    } catch (error) {
      console.error('上传错误:', error)
      setUploadResult({
        success: false,
        message: '网络错误，请重试'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-dark-500 text-white">
        {/* 顶部导航 */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/admin')}
                  className="text-gray-400 hover:text-white mr-4 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-primary-500" />
                  上传照片
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {uploadResult ? (
            <div className="max-w-md mx-auto text-center">
              {uploadResult.success ? (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-green-400 mb-2">
                    上传成功！
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {uploadResult.message}
                  </p>
                  <p className="text-sm text-gray-400">
                    正在跳转到管理页面...
                  </p>
                </div>
              ) : (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-red-400 mb-2">
                    上传失败
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {uploadResult.message}
                  </p>
                  <button
                    onClick={() => setUploadResult(null)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    重新上传
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">
                  上传新照片
                </h2>
                <p className="text-gray-400">
                  支持批量上传，可同时选择多张照片并编辑信息
                </p>
              </div>

              <PhotoUpload 
                onUpload={handleUpload}
                isUploading={isUploading}
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default UploadPage 