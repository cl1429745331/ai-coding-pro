'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface LikeButtonProps {
  photoId: string
  initialLikes: number
  className?: string
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  photoId, 
  initialLikes = 0,
  className = '' 
}) => {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 检查是否已经点赞
  useEffect(() => {
    const liked = localStorage.getItem(`liked_${photoId}`)
    setIsLiked(liked === 'true')
  }, [photoId])

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (isLiked) {
        // 取消点赞
        setLikes(prev => Math.max(0, prev - 1))
        setIsLiked(false)
        localStorage.removeItem(`liked_${photoId}`)
      } else {
        // 点赞
        setLikes(prev => prev + 1)
        setIsLiked(true)
        localStorage.setItem(`liked_${photoId}`, 'true')
      }
    } catch (error) {
      console.error('点赞操作失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        isLiked 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-gray-700 hover:bg-gray-600 text-white'
      } ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} 
        />
      </motion.div>
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        likes
      )}
    </motion.button>
  )
}

export default LikeButton 