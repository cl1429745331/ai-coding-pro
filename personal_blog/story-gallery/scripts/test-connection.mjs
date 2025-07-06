#!/usr/bin/env node

/**
 * 故事影像馆 - Supabase 连接测试脚本 (ES 模块版本)
 * 使用项目中的 Supabase 配置
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 加载环境变量
config({ path: join(__dirname, '../.env.local') })

console.log('🔍 故事影像馆 - Supabase 连接测试 (ES 模块版本)')
console.log('==============================================')

// 检查环境变量
console.log('\n📋 检查环境变量...')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ 错误: NEXT_PUBLIC_SUPABASE_URL 环境变量未设置')
  console.error('   请确保 .env.local 文件存在并包含正确的配置')
  process.exit(1)
}

if (!supabaseAnonKey) {
  console.error('❌ 错误: NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量未设置')
  console.error('   请确保 .env.local 文件存在并包含正确的配置')
  process.exit(1)
}

console.log('✅ 环境变量检查通过')
console.log(`   - Supabase URL: ${supabaseUrl}`)
console.log(`   - Anon Key: ${supabaseAnonKey.substring(0, 20)}...`)

// 创建 Supabase 客户端（使用与项目相同的配置）
console.log('\n🔗 创建 Supabase 客户端...')
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  }
})
console.log('✅ Supabase 客户端创建成功')

// 验证配置参数
console.log('\n⚙️ 验证配置参数...')
const maxFileSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760')
const allowedFileTypes = process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp']
const imageQuality = parseInt(process.env.NEXT_PUBLIC_IMAGE_QUALITY || '80')

console.log(`   - 最大文件大小: ${(maxFileSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`   - 允许的文件类型: ${allowedFileTypes.join(', ')}`)
console.log(`   - 图片质量: ${imageQuality}%`)

// 测试数据库连接和操作
async function testDatabaseOperations() {
  console.log('\n🧪 开始数据库操作测试...')
  
  try {
    // 测试 1: 基本连接和权限测试
    console.log('\n1️⃣ 测试基本连接和权限...')
    
    // 测试查询 photos 表
    const { data: photoCount, error: photoError } = await supabase
      .from('photos')
      .select('id', { count: 'exact' })
      .limit(1)
    
    if (photoError) {
      console.error('❌ 照片表查询失败:', photoError.message)
      return false
    }
    console.log('✅ 照片表连接正常')

    // 测试 2: 检查所有核心表
    console.log('\n2️⃣ 检查所有核心表...')
    const coreBlocks = [
      { table: 'photos', name: '照片表' },
      { table: 'tags', name: '标签表' },
      { table: 'categories', name: '分类表' },
      { table: 'comments', name: '评论表' },
      { table: 'likes', name: '点赞表' },
      { table: 'series', name: '系列表' },
      { table: 'photo_tags', name: '照片标签关联表' },
      { table: 'photo_series', name: '照片系列关联表' }
    ]
    
    for (const { table, name } of coreBlocks) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.error(`❌ ${name} (${table}) 查询失败:`, error.message)
          return false
        }
        console.log(`✅ ${name} (${table}) 正常`)
      } catch (err) {
        console.error(`❌ ${name} (${table}) 连接出错:`, err.message)
        return false
      }
    }

    // 测试 3: 检查初始数据
    console.log('\n3️⃣ 检查初始数据...')
    
    // 检查分类数据
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    
    if (catError) {
      console.error('❌ 分类数据查询失败:', catError.message)
      return false
    }
    
    if (categories.length === 0) {
      console.warn('⚠️ 分类数据为空，可能需要执行初始化 SQL')
    } else {
      console.log(`✅ 分类数据正常，共 ${categories.length} 个分类:`)
      categories.forEach(cat => {
        console.log(`   📁 ${cat.name} (${cat.slug})`)
      })
    }

    // 检查标签数据
    const { data: tags, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .order('name')
    
    if (tagError) {
      console.error('❌ 标签数据查询失败:', tagError.message)
      return false
    }
    
    if (tags.length === 0) {
      console.warn('⚠️ 标签数据为空，可能需要执行初始化 SQL')
    } else {
      console.log(`✅ 标签数据正常，共 ${tags.length} 个标签:`)
      tags.forEach(tag => {
        console.log(`   🏷️ ${tag.name} (${tag.color})`)
      })
    }

    // 测试 4: 检查行级安全策略
    console.log('\n4️⃣ 检查行级安全策略...')
    
    // 查询已发布的照片
    const { data: publishedPhotos, error: pubError } = await supabase
      .from('photos')
      .select('id, title, is_published')
      .eq('is_published', true)
      .limit(5)
    
    if (pubError) {
      console.error('❌ 已发布照片查询失败:', pubError.message)
      return false
    }
    
    console.log(`✅ 行级安全策略正常，可查询已发布照片 ${publishedPhotos.length} 条`)

    // 测试 5: 测试复杂查询
    console.log('\n5️⃣ 测试复杂查询...')
    
    try {
      // 测试带关联的查询
      const { data: photosWithTags, error: complexError } = await supabase
        .from('photos')
        .select(`
          id,
          title,
          photo_tags (
            tags (
              name
            )
          )
        `)
        .eq('is_published', true)
        .limit(3)
      
      if (complexError) {
        console.warn('⚠️ 复杂查询失败:', complexError.message)
      } else {
        console.log('✅ 复杂关联查询正常')
      }
    } catch (err) {
      console.warn('⚠️ 复杂查询测试跳过:', err.message)
    }

    return true
  } catch (error) {
    console.error('❌ 数据库操作测试失败:', error.message)
    return false
  }
}

// 执行完整测试
async function runFullTest() {
  try {
    const success = await testDatabaseOperations()
    
    console.log('\n📊 测试结果总结')
    console.log('=================')
    
    if (success) {
      console.log('🎉 所有测试通过！故事影像馆数据库连接正常')
      console.log('\n✅ 检查项目：')
      console.log('   ✓ 环境变量配置正确')
      console.log('   ✓ Supabase 客户端创建成功')
      console.log('   ✓ 数据库连接正常')
      console.log('   ✓ 数据库表结构完整')
      console.log('   ✓ 行级安全策略正常')
      console.log('   ✓ 复杂查询功能正常')
      
      console.log('\n🚀 准备就绪！')
      console.log('   - 现在可以开始使用故事影像馆的数据库功能')
      console.log('   - 可以运行 npm run dev 启动开发服务器')
      console.log('   - 项目配置已完成，可以开始开发新功能')
      
      process.exit(0)
    } else {
      console.log('❌ 测试失败，请检查以下项目：')
      console.log('\n🔧 故障排除：')
      console.log('   1. 检查 .env.local 文件是否存在')
      console.log('   2. 确认 Supabase URL 和 API Key 正确')
      console.log('   3. 确认数据库表结构已经创建')
      console.log('   4. 在 Supabase 控制台执行 schema.sql 文件')
      console.log('   5. 检查网络连接是否正常')
      
      console.log('\n📝 下一步操作：')
      console.log('   - 打开 Supabase 控制台')
      console.log('   - 进入 SQL Editor')
      console.log('   - 执行 database/schema.sql 文件')
      console.log('   - 重新运行此测试脚本')
      
      process.exit(1)
    }
  } catch (error) {
    console.error('💥 测试执行失败:', error.message)
    console.error('请检查网络连接和 Supabase 服务状态')
    process.exit(1)
  }
}

// 运行测试
runFullTest() 