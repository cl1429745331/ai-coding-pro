import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Photo } from '@/lib/supabase'
import { motion } from 'framer-motion'

interface PhotoGridProps {
  photos: Photo[]
  onPhotoClick?: (photo: Photo) => void
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="break-inside-avoid"
        >
          <PhotoCard 
            photo={photo} 
            onClick={() => onPhotoClick?.(photo)}
          />
        </motion.div>
      ))}
    </div>
  )
}

interface PhotoCardProps {
  photo: Photo
  onClick: () => void
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      className="relative group cursor-pointer mb-4 rounded-lg overflow-hidden bg-gray-800"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {/* 图片容器 */}
      <div className="relative">
        {!imageLoaded && !imageError && (
          <div className="aspect-[3/4] bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        
        {!imageError && (
          <Image
            src={`https://picsum.photos/seed/${photo.id}/${photo.width || 400}/${photo.height || 600}`}
            alt={photo.title}
            width={photo.width || 400}
            height={photo.height || 600}
            className={`w-full h-auto transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={false}
          />
        )}
        
        {imageError && (
          <div className="aspect-[3/4] bg-gray-700 flex items-center justify-center">
            <div className="text-gray-400">Failed to load</div>
          </div>
        )}

        {/* 悬浮遮罩 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
              {photo.title}
            </h3>
            {photo.description && (
              <p className="text-sm text-gray-200 line-clamp-2">
                {photo.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
              <span>{photo.likes_count} 喜欢</span>
              {photo.taken_at && (
                <span>{new Date(photo.taken_at).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PhotoGrid 