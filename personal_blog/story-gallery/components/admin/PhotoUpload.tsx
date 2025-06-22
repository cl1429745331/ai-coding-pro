'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Save, Eye, Tag, MapPin, Camera, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface PhotoUploadProps {
  onUpload: (data: PhotoUploadData[]) => Promise<void>
  isUploading?: boolean
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload, isUploading = false }) => {
  const [photos, setPhotos] = useState<PhotoUploadData[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件选择
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newPhotos: PhotoUploadData[] = []
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          newPhotos.push({
            file,
            preview,
            title: file.name.replace(/\.[^/.]+$/, ''),
            description: '',
            location: '',
            tags: [],
            taken_at: new Date().toISOString().split('T')[0],
            is_published: false
          })
          
          if (newPhotos.length === files.length) {
            setPhotos(prev => [...prev, ...newPhotos])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }, [])

  // 拖拽处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  // 更新照片信息
  const updatePhoto = (index: number, field: keyof PhotoUploadData, value: any) => {
    setPhotos(prev => prev.map((photo, i) => 
      i === index ? { ...photo, [field]: value } : photo
    ))
  }

  // 删除照片
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // 添加标签
  const addTag = (index: number, tag: string) => {
    if (tag.trim()) {
      updatePhoto(index, 'tags', [...photos[index].tags, tag.trim()])
    }
  }

  // 删除标签
  const removeTag = (photoIndex: number, tagIndex: number) => {
    const newTags = photos[photoIndex].tags.filter((_, i) => i !== tagIndex)
    updatePhoto(photoIndex, 'tags', newTags)
  }

  // 提交上传
  const handleSubmit = async () => {
    if (photos.length === 0) return
    await onUpload(photos)
    setPhotos([])
  }

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-white mb-2">
          拖拽照片到这里或点击选择
        </p>
        <p className="text-gray-400 text-sm">
          支持 JPG、PNG、WebP 等格式，可同时选择多张照片
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* 照片列表 */}
      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                待上传照片 ({photos.length})
              </h3>
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    上传中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    批量上传
                  </>
                )}
              </button>
            </div>

            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* 照片预览 */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={photo.preview}
                        alt={photo.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        标题 *
                      </label>
                      <input
                        type="text"
                        value={photo.title}
                        onChange={(e) => updatePhoto(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入照片标题"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        描述
                      </label>
                      <textarea
                        value={photo.description}
                        onChange={(e) => updatePhoto(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="描述这张照片的故事..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        拍摄地点
                      </label>
                      <input
                        type="text"
                        value={photo.location}
                        onChange={(e) => updatePhoto(index, 'location', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="拍摄地点"
                      />
                    </div>
                  </div>

                  {/* 高级信息 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        拍摄时间
                      </label>
                      <input
                        type="date"
                        value={photo.taken_at}
                        onChange={(e) => updatePhoto(index, 'taken_at', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Tag className="w-4 h-4 inline mr-1" />
                        标签
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {photo.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full text-sm flex items-center"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(index, tagIndex)}
                              className="ml-1 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(index, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入标签后按回车"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`publish-${index}`}
                        checked={photo.is_published}
                        onChange={(e) => updatePhoto(index, 'is_published', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={`publish-${index}`} className="text-sm text-gray-300">
                        立即发布
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotoUpload 