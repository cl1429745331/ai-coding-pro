import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const uploadData = JSON.parse(formData.get('data') as string)

    if (!files.length) {
      return NextResponse.json({ error: '没有文件上传' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads')
    
    // 确保上传目录存在
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    const uploadedPhotos = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const data = uploadData[i]
      
      if (!file || !data) continue

      // 生成唯一文件名
      const fileId = generateId()
      const fileExtension = path.extname(file.name)
      const fileName = `${fileId}${fileExtension}`
      const filePath = path.join(uploadDir, fileName)

      // 保存文件
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await fs.writeFile(filePath, buffer)

      // 获取图片尺寸（简单模拟）
      const width = 1920
      const height = 1280

      // 构建照片数据
      const photoData = {
        id: fileId,
        title: data.title,
        description: data.description,
        file_name: fileName,
        file_size: buffer.length,
        width,
        height,
        exif_data: {
          camera: 'Canon EOS R5',
          lens: 'EF 24-70mm f/2.8L II USM',
          settings: {
            iso: 400,
            aperture: 'f/5.6',
            shutter_speed: '1/125s',
            focal_length: '50mm'
          }
        },
        tags: data.tags,
        location: data.location,
        taken_at: data.taken_at,
        is_published: data.is_published,
        likes_count: 0,
        views_count: 0,
        published_at: data.is_published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      uploadedPhotos.push(photoData)

      // 在实际项目中，这里应该保存到 Supabase 数据库
      // await supabase.from('photos').insert(photoData)

      // 临时保存到本地 JSON 文件（开发阶段）
      const dbPath = path.join(process.cwd(), 'public/db.json')
      let db: any = { photos: [] }
      
      try {
        const dbContent = await fs.readFile(dbPath, 'utf-8')
        db = JSON.parse(dbContent)
      } catch {
        // 文件不存在，使用默认结构
      }

      if (!db.photos) db.photos = []
      db.photos.push(photoData)

      await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
    }

    return NextResponse.json({ 
      success: true, 
      photos: uploadedPhotos,
      message: `成功上传 ${uploadedPhotos.length} 张照片`
    })

  } catch (error) {
    console.error('上传错误:', error)
    return NextResponse.json({ 
      error: '上传失败，请重试' 
    }, { status: 500 })
  }
} 