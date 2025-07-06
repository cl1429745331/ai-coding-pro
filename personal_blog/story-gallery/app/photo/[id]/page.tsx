'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PhotoService, CommentService, LikeService } from '../../../lib/database'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Photo {
  id: string
  title: string
  description?: string
  story?: string
  image_url: string
  camera_model?: string
  lens?: string
  aperture?: string
  shutter_speed?: string
  iso?: number
  focal_length?: number
  location?: string
  taken_at?: string
  created_at: string
  published_at?: string
  view_count: number
  like_count: number
  comment_count: number
  photo_tags?: Array<{
    tags: {
      id: string
      name: string
      color: string
    }
  }>
  tags?: Array<{
    id: string
    name: string
    color: string
  }>
  comments?: Array<{
    id: string
    author_name: string
    content: string
    created_at: string
  }>
}

interface Comment {
  author_name: string
  content: string
  author_email?: string
}

export default function PhotoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const photoId = params.id as string
  
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentForm, setCommentForm] = useState<Comment>({
    author_name: '',
    content: '',
    author_email: ''
  })
  const [submittingComment, setSubmittingComment] = useState(false)

  // 加载照片详情
  const loadPhoto = async () => {
    try {
      setLoading(true)
      const { data, error } = await PhotoService.getPhotoById(photoId)
      
      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('照片不存在')
      }

      // 转换数据格式
      const formattedPhoto = {
        ...data,
        tags: data.photo_tags?.map((pt: any) => pt.tags).filter((tag: any) => tag && tag.name) || []
      }

      setPhoto(formattedPhoto)
      setLikeCount(data.like_count)
      
      // 增加浏览量
      PhotoService.incrementViewCount(photoId)
      
      // 检查点赞状态
      checkLikeStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载照片失败')
    } finally {
      setLoading(false)
    }
  }

  // 检查点赞状态
  const checkLikeStatus = async () => {
    try {
      // 获取用户IP（简化处理，实际项目中需要服务端获取）
      const userIP = '127.0.0.1' // 这里应该从服务端获取真实IP
      const { liked } = await LikeService.checkLikeStatus(photoId, userIP)
      setLiked(liked)
    } catch (err) {
      console.error('检查点赞状态失败:', err)
    }
  }

  // 处理点赞/取消点赞
  const handleLike = async () => {
    try {
      const userIP = '127.0.0.1' // 这里应该从服务端获取真实IP
      
      if (liked) {
        await LikeService.unlikePhoto(photoId, userIP)
        setLiked(false)
        setLikeCount(prev => prev - 1)
      } else {
        await LikeService.likePhoto(photoId, userIP)
        setLiked(true)
        setLikeCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('点赞操作失败:', err)
    }
  }

  // 提交评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentForm.author_name.trim() || !commentForm.content.trim()) {
      alert('请填写姓名和评论内容')
      return
    }

    try {
      setSubmittingComment(true)
      
      await CommentService.addComment(
        photoId,
        commentForm.author_name.trim(),
        commentForm.content.trim(),
        commentForm.author_email?.trim() || undefined
      )

      // 重置表单
      setCommentForm({
        author_name: '',
        content: '',
        author_email: ''
      })
      setShowCommentForm(false)
      
      // 重新加载照片数据以获取最新评论
      loadPhoto()
      
      alert('评论提交成功，待审核后显示')
    } catch (err) {
      console.error('提交评论失败:', err)
      alert('评论提交失败，请稍后再试')
    } finally {
      setSubmittingComment(false)
    }
  }

  // 格式化时间
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: zhCN 
      })
    } catch {
      return '未知时间'
    }
  }

  // 格式化拍摄时间
  const formatTakenTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return '未知时间'
    }
  }

  useEffect(() => {
    if (photoId) {
      loadPhoto()
    }
  }, [photoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">加载中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-white mb-4">加载失败</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.back()}
                className="btn-secondary"
              >
                返回上页
              </button>
              <button 
                onClick={loadPhoto}
                className="btn-primary"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">照片不存在</h1>
          <Link href="/" className="btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* 导航栏 */}
      <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="text-white/60 text-sm">
                {photo.view_count} 次浏览
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：照片展示 */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
              <Image
                src={photo.image_url}
                alt={photo.title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {/* 互动区域 */}
            <div className="mt-6 flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                }`}
              >
                <svg className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeCount}
              </button>

              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                评论 ({photo.comment_count})
              </button>
            </div>
          </div>

          {/* 右侧：照片信息 */}
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">{photo.title}</h1>
              
              {photo.description && (
                <p className="text-white/80 mb-4 leading-relaxed">{photo.description}</p>
              )}

              {photo.story && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-2">照片故事</h3>
                  <p className="text-white/70 leading-relaxed">{photo.story}</p>
                </div>
              )}

              {/* 标签 */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-white/60 mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.filter(tag => tag && tag.name).map((tag, index) => {
                      const tagColor = tag.color || '#3B82F6'; // 默认蓝色
                      return (
                        <span 
                          key={tag.id || tag.name || index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                          style={{ 
                            backgroundColor: `${tagColor}20`,
                            borderColor: `${tagColor}50`,
                            color: tagColor 
                          }}
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 发布时间 */}
              <div className="text-sm text-white/60">
                发布于 {formatTime(photo.published_at || photo.created_at)}
              </div>
            </div>

            {/* 拍摄参数 */}
            {(photo.camera_model || photo.lens || photo.aperture || photo.shutter_speed || photo.iso || photo.focal_length) && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  拍摄参数
                </h3>
                
                <div className="space-y-3">
                  {photo.camera_model && (
                    <div className="flex justify-between">
                      <span className="text-white/60">相机</span>
                      <span className="text-white">{photo.camera_model}</span>
                    </div>
                  )}
                  
                  {photo.lens && (
                    <div className="flex justify-between">
                      <span className="text-white/60">镜头</span>
                      <span className="text-white">{photo.lens}</span>
                    </div>
                  )}
                  
                  {photo.aperture && (
                    <div className="flex justify-between">
                      <span className="text-white/60">光圈</span>
                      <span className="text-white">{photo.aperture}</span>
                    </div>
                  )}
                  
                  {photo.shutter_speed && (
                    <div className="flex justify-between">
                      <span className="text-white/60">快门</span>
                      <span className="text-white">{photo.shutter_speed}</span>
                    </div>
                  )}
                  
                  {photo.iso && (
                    <div className="flex justify-between">
                      <span className="text-white/60">ISO</span>
                      <span className="text-white">{photo.iso}</span>
                    </div>
                  )}
                  
                  {photo.focal_length && (
                    <div className="flex justify-between">
                      <span className="text-white/60">焦距</span>
                      <span className="text-white">{photo.focal_length}mm</span>
                    </div>
                  )}
                  
                  {photo.location && (
                    <div className="flex justify-between">
                      <span className="text-white/60">拍摄地点</span>
                      <span className="text-white">{photo.location}</span>
                    </div>
                  )}
                  
                  {photo.taken_at && (
                    <div className="flex justify-between">
                      <span className="text-white/60">拍摄时间</span>
                      <span className="text-white">{formatTakenTime(photo.taken_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 评论区域 */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">评论 ({photo.comment_count})</h3>

          {/* 评论表单 */}
          {showCommentForm && (
            <div className="bg-[#1A1A1A] rounded-lg p-6 mb-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="您的姓名 *"
                    value={commentForm.author_name}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, author_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#262626] border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <input
                    type="email"
                    placeholder="邮箱地址（可选）"
                    value={commentForm.author_email}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, author_email: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#262626] border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="写下您的评论... *"
                  value={commentForm.content}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#262626] border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none resize-none"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? '提交中...' : '提交评论'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 评论列表 */}
          {photo.comments && photo.comments.length > 0 ? (
            <div className="space-y-4">
              {photo.comments.map((comment) => (
                <div key={comment.id} className="bg-[#1A1A1A] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{comment.author_name}</h4>
                    <span className="text-sm text-white/60">
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white/60 mb-4">还没有评论</p>
              {!showCommentForm && (
                <button
                  onClick={() => setShowCommentForm(true)}
                  className="btn-primary"
                >
                  写下第一条评论
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 