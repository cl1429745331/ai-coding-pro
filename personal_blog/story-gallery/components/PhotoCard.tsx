'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PhotoCardProps {
  photo: {
    id: string
    title: string
    description?: string
    thumbnail_url?: string
    image_url: string
    camera_model?: string
    location?: string
    created_at: string
    published_at?: string
    tags?: Array<{
      name: string
      color: string
    }>
  }
  index: number
}

export default function PhotoCard({ photo, index }: PhotoCardProps) {
  const imageUrl = photo.thumbnail_url || photo.image_url
  const publishTime = photo.published_at || photo.created_at
  
  // 格式化发布时间
  const formatPublishTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: zhCN 
      })
    } catch {
      return '刚刚'
    }
  }

  return (
    <Link href={`/photo/${photo.id}`}>
      <div 
        className="photo-card fade-in cursor-pointer group"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative overflow-hidden rounded-lg">
          {/* 照片图片 */}
          <Image
            src={imageUrl}
            alt={photo.title}
            width={400}
            height={600}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* 悬浮遮罩 */}
          <div className="photo-overlay">
            <div className="absolute bottom-4 left-4 right-4">
              {/* 标题 */}
              <h3 className="text-white font-medium text-lg mb-2 line-clamp-1">
                {photo.title}
              </h3>
              
              {/* 摘要描述 */}
              {photo.description && (
                <p className="text-white/80 text-sm mb-3 line-clamp-2">
                  {photo.description}
                </p>
              )}
              
              {/* 相机信息 */}
              {photo.camera_model && (
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/80 text-sm truncate">{photo.camera_model}</span>
                </div>
              )}
              
              {/* 位置信息 */}
              {photo.location && (
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/80 text-sm truncate">{photo.location}</span>
                </div>
              )}
              
              {/* 发布时间 */}
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80 text-sm">
                  {formatPublishTime(publishTime)}
                </span>
              </div>
              
              {/* 标签 */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {photo.tags.slice(0, 3).filter(tag => tag && tag.name).map((tag, index) => {
                    const tagColor = tag.color || '#3B82F6'; // 默认蓝色
                    return (
                      <span 
                        key={tag.name || index} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
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
                  {photo.tags.filter(tag => tag && tag.name).length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/20">
                      +{photo.tags.filter(tag => tag && tag.name).length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 