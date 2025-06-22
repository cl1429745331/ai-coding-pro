import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params

    // 从Supabase Storage获取图片
    const { data, error } = await supabase.storage
      .from('photos')
      .download(filename)

    if (error) {
      console.error('获取图片失败:', error)
      return NextResponse.json({ error: '图片不存在' }, { status: 404 })
    }

    // 设置响应头
    const response = new NextResponse(data)
    response.headers.set('Content-Type', 'image/jpeg')
    response.headers.set('Cache-Control', 'public, max-age=31536000')

    return response
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
} 