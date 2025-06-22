import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPhotos } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await getPublishedPhotos(limit, offset)

    if (error) {
      console.error('获取照片列表失败:', error)
      return NextResponse.json({ error: '获取照片失败' }, { status: 500 })
    }

    return NextResponse.json({ photos: data })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
} 