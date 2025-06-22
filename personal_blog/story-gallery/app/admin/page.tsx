'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getAdminSession, adminLogout } from '@/lib/auth'
import { getMockPhotos } from '@/lib/mockData'
import { Photo } from '@/lib/supabase'
import { Upload, Settings, BarChart3, LogOut, Plus, Eye, Edit, Trash2 } from 'lucide-react'

const AdminDashboard = () => {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [stats, setStats] = useState({
    totalPhotos: 0,
    publishedPhotos: 0,
    totalLikes: 0,
    totalViews: 0
  })

  useEffect(() => {
    // 加载照片数据
    const mockPhotos = getMockPhotos(50, 0)
    setPhotos(mockPhotos)
    
    // 计算统计数据
    const publishedCount = mockPhotos.filter(p => p.is_published).length
    const totalLikes = mockPhotos.reduce((sum, p) => sum + (p.likes_count || 0), 0)
    
    setStats({
      totalPhotos: mockPhotos.length,
      publishedPhotos: publishedCount,
      totalLikes,
      totalViews: 1234 // 模拟数据
    })
  }, [])

  const handleLogout = () => {
    adminLogout()
    router.push('/')
  }

  const handlePhotoAction = (photoId: string, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/photo/${photoId}`)
        break
      case 'edit':
        router.push(`/admin/photos/${photoId}/edit`)
        break
      case 'delete':
        if (confirm('确定要删除这张照片吗？')) {
          // TODO: 实现删除逻辑
          console.log('Delete photo:', photoId)
        }
        break
    }
  }

  return (
    <div className="min-h-screen bg-dark-500">
      {/* 顶部导航 */}
      <header className="bg-dark-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">故事影像馆 - 管理后台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                欢迎，{getAdminSession()?.username}
              </span>
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">总照片数</p>
                <p className="text-2xl font-semibold text-white">{stats.totalPhotos}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">已发布</p>
                <p className="text-2xl font-semibold text-white">{stats.publishedPhotos}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 text-red-500">❤️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">总点赞</p>
                <p className="text-2xl font-semibold text-white">{stats.totalLikes}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">总浏览</p>
                <p className="text-2xl font-semibold text-white">{stats.totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">快捷操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/upload')}
              className="bg-primary-500 hover:bg-primary-600 text-white p-6 rounded-lg flex items-center transition-colors"
            >
              <Upload className="h-6 w-6 mr-3" />
              上传照片
            </button>
            <button
              onClick={() => router.push('/admin/photos')}
              className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-lg flex items-center transition-colors"
            >
              <Edit className="h-6 w-6 mr-3" />
              管理照片
            </button>
            <button
              onClick={() => router.push('/admin/settings')}
              className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-lg flex items-center transition-colors"
            >
              <Settings className="h-6 w-6 mr-3" />
              系统设置
            </button>
          </div>
        </div>

        {/* 最近照片 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">最近照片</h2>
            <button
              onClick={() => router.push('/admin/photos')}
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
            >
              查看全部
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      照片
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      点赞
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {photos.slice(0, 5).map((photo) => (
                    <tr key={photo.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-16 bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={`https://picsum.photos/seed/${photo.id}/64/64`}
                            alt={photo.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{photo.title}</div>
                        <div className="text-sm text-gray-400">{photo.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                          photo.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {photo.is_published ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {photo.likes_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePhotoAction(photo.id, 'view')}
                            className="text-primary-400 hover:text-primary-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePhotoAction(photo.id, 'edit')}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePhotoAction(photo.id, 'delete')}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
} 