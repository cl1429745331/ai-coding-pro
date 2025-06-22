import { Photo } from './supabase'

// 模拟照片数据，用于演示
export const mockPhotos: Photo[] = [
  {
    id: '1',
    title: '夕阳下的山峦',
    description: '在黄昏时分，远山如画，夕阳西下，天空被染成金黄色，这一刻的美好值得永远记住。',
    file_name: 'sunset-mountains.jpg',
    file_size: 2048000,
    width: 1920,
    height: 1080,
    exif_data: {
      camera: 'Canon EOS R5',
      lens: 'RF 24-70mm f/2.8',
      aperture: '2.8',
      shutter_speed: '1/125',
      iso: 100,
      focal_length: '50'
    },
    tags: ['风景', '山川', '夕阳', '自然'],
    location: '云南大理',
    taken_at: '2024-12-15T18:30:00.000Z',
    is_published: true,
    likes_count: 23,
    published_at: '2024-12-22T10:00:00.000Z',
    created_at: '2024-12-22T12:00:00.000Z',
    updated_at: '2024-12-22T12:00:00.000Z'
  },
  {
    id: '2',
    title: '城市夜景',
    description: '繁华都市的夜晚，霓虹灯闪烁，车流如河，展现现代城市的活力与魅力。',
    file_name: 'city-night.jpg',
    file_size: 1567000,
    width: 1600,
    height: 1200,
    exif_data: {
      camera: 'Sony A7R IV',
      lens: 'FE 16-35mm f/2.8',
      aperture: '8.0',
      shutter_speed: '8',
      iso: 200,
      focal_length: '24'
    },
    tags: ['城市', '夜景', '霓虹', '建筑'],
    location: '上海外滩',
    taken_at: '2024-12-10T20:45:00.000Z',
    is_published: true,
    likes_count: 45,
    published_at: '2024-12-22T10:30:00.000Z',
    created_at: '2024-12-22T12:00:00.000Z',
    updated_at: '2024-12-22T12:00:00.000Z'
  },
  {
    id: '3',
    title: '海边日出',
    description: '清晨第一缕阳光照耀在海面上，波光粼粼，海鸥飞翔，新的一天充满希望。',
    file_name: 'sunrise-sea.jpg',
    file_size: 1890000,
    width: 1800,
    height: 1350,
    exif_data: {
      camera: 'Nikon Z9',
      lens: 'Z 70-200mm f/2.8',
      aperture: '5.6',
      shutter_speed: '1/200',
      iso: 320,
      focal_length: '135'
    },
    tags: ['海景', '日出', '自然', '希望'],
    location: '青岛金沙滩',
    taken_at: '2024-12-08T06:15:00.000Z',
    is_published: true,
    likes_count: 67,
    published_at: '2024-12-22T11:00:00.000Z',
    created_at: '2024-12-22T12:00:00.000Z',
    updated_at: '2024-12-22T12:00:00.000Z'
  },
  {
    id: '4',
    title: '雨后彩虹',
    description: '一场夏日暴雨过后，天空出现了完整的彩虹，横跨在绿色的田野上方，大自然的奇迹总是让人惊叹。',
    file_name: 'rainbow-field.jpg',
    file_size: 1234000,
    width: 1600,
    height: 900,
    exif_data: {
      camera: 'Canon EOS R6',
      lens: 'EF 24-105mm f/4',
      aperture: '11',
      shutter_speed: '1/60',
      iso: 400,
      focal_length: '85'
    },
    tags: ['彩虹', '田野', '雨后', '自然奇观'],
    location: '内蒙古呼伦贝尔',
    taken_at: '2024-12-05T15:20:00.000Z',
    is_published: true,
    likes_count: 34,
    published_at: '2024-12-22T11:30:00.000Z',
    created_at: '2024-12-22T12:00:00.000Z',
    updated_at: '2024-12-22T12:00:00.000Z'
  },
  {
    id: '5',
    title: '雪山倒影',
    description: '高原湖泊清澈如镜，雪山倒影其中，蓝天白云与雪峰交相辉映，构成了一幅完美的画卷。',
    file_name: 'snow-mountain-reflection.jpg',
    file_size: 2345000,
    width: 2000,
    height: 1333,
    exif_data: {
      camera: 'Fujifilm X-T5',
      lens: 'XF 16-80mm f/4',
      aperture: '8.0',
      shutter_speed: '1/125',
      iso: 160,
      focal_length: '35'
    },
    tags: ['雪山', '湖泊', '倒影', '高原'],
    location: '西藏纳木错',
    taken_at: '2024-12-01T14:00:00.000Z',
    is_published: true,
    likes_count: 89,
    published_at: '2024-12-22T12:00:00.000Z',
    created_at: '2024-12-22T12:00:00.000Z',
    updated_at: '2024-12-22T12:00:00.000Z'
  },
  {
    id: '6',
    title: '古镇小巷',
    description: '江南古镇的青石板路，两旁是白墙黛瓦的传统建筑，时光在这里仿佛慢了下来。',
    file_name: 'ancient-town-alley.jpg',
    file_size: 1678000,
    width: 1200,
    height: 1600,
    exif_data: {
      camera: 'Leica Q2',
      lens: 'Summilux 28mm f/1.7',
      aperture: '4.0',
      shutter_speed: '1/80',
      iso: 200,
      focal_length: '28'
    },
    tags: ['古镇', '江南', '传统建筑', '文化'],
    location: '浙江乌镇',
    taken_at: '2024-11-28T16:30:00.000Z',
    is_published: true,
    likes_count: 52,
    published_at: '2024-12-22T12:30:00.000Z',
    created_at: '2024-12-22T12:00:00.000Z',
    updated_at: '2024-12-22T12:00:00.000Z'
  }
]

// 根据ID获取照片
export const getMockPhotoById = (id: string): Photo | null => {
  return mockPhotos.find(photo => photo.id === id) || null
}

// 获取上传的照片（仅在客户端）
export const getUploadedPhotos = async (): Promise<Photo[]> => {
  if (typeof window === 'undefined') return []
  
  try {
    const response = await fetch('/db.json')
    if (!response.ok) return []
    
    const data = await response.json()
    if (!data.photos) return []
    
    return data.photos.map((photo: any) => ({
      ...photo,
      image_url: `/api/uploads/${photo.file_name}`,
      thumbnail_url: `/api/uploads/${photo.file_name}`
    }))
  } catch (error) {
    return []
  }
}

// 获取模拟照片列表（合并上传的照片和模拟数据）
export const getMockPhotos = (limit: number = 20, offset: number = 0): Photo[] => {
  return mockPhotos.slice(offset, offset + limit)
}

// 获取所有照片（包括上传的和模拟的）
export const getAllPhotos = async (limit: number = 20, offset: number = 0): Promise<Photo[]> => {
  const uploadedPhotos = await getUploadedPhotos()
  const allPhotos = [...uploadedPhotos, ...mockPhotos]
  return allPhotos.slice(offset, offset + limit)
} 