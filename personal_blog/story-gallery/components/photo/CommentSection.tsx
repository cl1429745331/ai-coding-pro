'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Clock, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Comment {
  id: string
  photo_id: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
}

interface CommentSectionProps {
  photoId: string
  initialComments?: Comment[]
}

const CommentSection: React.FC<CommentSectionProps> = ({ photoId, initialComments = [] }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState({
    author_name: '',
    author_email: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.author_name.trim() || !newComment.content.trim()) {
      alert('请填写姓名和评论内容')
      return
    }

    setIsSubmitting(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 添加新评论到列表（显示为待审核状态）
      const comment: Comment = {
        id: Date.now().toString(),
        photo_id: photoId,
        author_name: newComment.author_name,
        author_email: newComment.author_email,
        content: newComment.content,
        is_approved: false,
        created_at: new Date().toISOString()
      }
      
      setComments(prev => [comment, ...prev])
      setNewComment({ author_name: '', author_email: '', content: '' })
      setShowForm(false)
    } catch (error) {
      console.error('评论提交错误:', error)
      alert('网络错误，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 模拟加载已有评论
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        photo_id: photoId,
        author_name: '摄影爱好者',
        author_email: 'user@example.com',
        content: '这张照片拍得真棒！光影效果特别好，构图也很有感觉。',
        is_approved: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        photo_id: photoId,
        author_name: '风景控',
        author_email: 'landscape@example.com',
        content: '这个地方我也去过，但是拍不出这种效果。请问用的什么镜头？',
        is_approved: true,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    if (comments.length === 0) {
      setComments(mockComments)
    }
  }, [photoId, comments.length])

  const approvedComments = comments.filter(comment => comment.is_approved)
  const pendingComments = comments.filter(comment => !comment.is_approved)

  return (
    <div className="space-y-6">
      {/* 评论标题和统计 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-white">
            评论 ({approvedComments.length})
          </h3>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          写评论
        </button>
      </div>

      {/* 评论表单 */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={newComment.author_name}
                    onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={newComment.author_email}
                    onChange={(e) => setNewComment(prev => ({ ...prev, author_email: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="邮箱地址（可选）"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  评论内容 *
                </label>
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="分享您对这张照片的想法..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      发表评论
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 待审核评论提示 */}
      {pendingComments.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-400 text-sm">
              您有 {pendingComments.length} 条评论正在等待审核
            </span>
          </div>
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {approvedComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">还没有评论，成为第一个评论者吧！</p>
          </div>
        ) : (
          <AnimatePresence>
            {approvedComments.map(comment => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">
                          {comment.author_name}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {formatTime(comment.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default CommentSection 