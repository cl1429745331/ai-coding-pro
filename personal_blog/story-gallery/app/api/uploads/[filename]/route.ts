import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename

    // 验证文件名格式，防止路径遍历攻击
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return notFound()
    }

    const filePath = path.join(process.cwd(), 'public/uploads', filename)
    
    try {
      const fileBuffer = await readFile(filePath)
      
      // 根据文件扩展名设置正确的 Content-Type
      const ext = path.extname(filename).toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.webp':
          contentType = 'image/webp'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.svg':
          contentType = 'image/svg+xml'
          break
      }

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000', // 缓存1年
        },
      })
    } catch (error) {
      return notFound()
    }
  } catch (error) {
    console.error('文件服务错误:', error)
    return NextResponse.json(
      { error: '文件服务错误' },
      { status: 500 }
    )
  }
} 