#!/usr/bin/env node

/**
 * 故事影像馆 - Supabase 连接测试脚本
 * 用于验证环境变量配置和数据库连接是否正常
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// 手动加载环境变量（因为这是一个独立脚本）
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

console.log('🔍 故事影像馆 - Supabase 连接测试')
console.log('=====================================')

// 检查环境变量
console.log('\n📋 检查环境变量...')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ 错误: NEXT_PUBLIC_SUPABASE_URL 环境变量未设置')
  process.exit(1)
}

if (!supabaseAnonKey) {
  console.error('❌ 错误: NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量未设置')
  process.exit(1)
}

console.log('✅ 环境变量检查通过')
console.log(`   - Supabase URL: ${supabaseUrl}`)
console.log(`   - Anon Key: ${supabaseAnonKey.substring(0, 20)}...`)

// 创建 Supabase 客户端
console.log('\n🔗 创建 Supabase 客户端...')
const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('✅ Supabase 客户端创建成功')

// 测试函数
async function testConnection() {
  try {
    // 测试 1: 基本连接测试
    console.log('\n🧪 测试 1: 基本连接测试...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('photos')
      .select('count(*)')
      .limit(1)
    
    if (healthError) {
      console.error('❌ 基本连接失败:', healthError.message)
      return false
    }
    console.log('✅ 基本连接测试通过')

    // 测试 2: 检查表是否存在
    console.log('\n🧪 测试 2: 检查数据库表...')
    const tables = ['photos', 'tags', 'categories', 'comments', 'likes', 'series']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.error(`❌ 表 '${table}' 检查失败:`, error.message)
          return false
        }
        console.log(`✅ 表 '${table}' 存在且可访问`)
      } catch (err) {
        console.error(`❌ 表 '${table}' 检查出错:`, err.message)
        return false
      }
    }

    // 测试 3: 检查初始数据
    console.log('\n🧪 测试 3: 检查初始数据...')
    
    // 检查分类数据
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
    
    if (catError) {
      console.error('❌ 分类数据检查失败:', catError.message)
      return false
    }
    
    console.log(`✅ 分类数据检查通过，共 ${categories.length} 个分类:`)
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`)
    })

    // 检查标签数据
    const { data: tags, error: tagError } = await supabase
      .from('tags')
      .select('*')
    
    if (tagError) {
      console.error('❌ 标签数据检查失败:', tagError.message)
      return false
    }
    
    console.log(`✅ 标签数据检查通过，共 ${tags.length} 个标签:`)
    tags.forEach(tag => {
      console.log(`   - ${tag.name} (${tag.color})`)
    })

    // 测试 4: 检查行级安全策略
    console.log('\n🧪 测试 4: 检查行级安全策略...')
    
    // 尝试查询已发布的照片（应该成功）
    const { data: publishedPhotos, error: pubError } = await supabase
      .from('photos')
      .select('*')
      .eq('is_published', true)
      .limit(5)
    
    if (pubError) {
      console.error('❌ 已发布照片查询失败:', pubError.message)
      return false
    }
    
    console.log(`✅ 行级安全策略正常，可查询已发布照片 ${publishedPhotos.length} 条`)

    // 测试 5: 检查视图
    console.log('\n🧪 测试 5: 检查数据库视图...')
    
    try {
      const { data: photoDetails, error: viewError } = await supabase
        .from('photo_details')
        .select('*')
        .limit(1)
      
      if (viewError) {
        console.warn('⚠️ photo_details 视图可能不存在:', viewError.message)
      } else {
        console.log('✅ photo_details 视图正常')
      }
    } catch (err) {
      console.warn('⚠️ 视图检查跳过:', err.message)
    }

    return true
  } catch (error) {
    console.error('❌ 连接测试失败:', error.message)
    return false
  }
}

// 执行测试
async function runTests() {
  try {
    const success = await testConnection()
    
    console.log('\n📊 测试结果总结')
    console.log('=================')
    
    if (success) {
      console.log('🎉 所有测试通过！Supabase 连接正常')
      console.log('✅ 环境变量配置正确')
      console.log('✅ 数据库连接成功')
      console.log('✅ 数据库表结构正常')
      console.log('✅ 初始数据已就绪')
      console.log('✅ 行级安全策略正常')
      console.log('\n🚀 你现在可以开始使用故事影像馆的数据库功能了！')
      process.exit(0)
    } else {
      console.log('❌ 测试失败，请检查以下几点：')
      console.log('   1. 确认 .env.local 文件存在且配置正确')
      console.log('   2. 确认 Supabase URL 和 API Key 正确')
      console.log('   3. 确认数据库表结构已经创建')
      console.log('   4. 确认 Supabase 项目正常运行')
      console.log('\n🔧 解决方案：')
      console.log('   - 检查 .env.local 文件中的环境变量')
      console.log('   - 在 Supabase 控制台执行 schema.sql 文件')
      console.log('   - 确认网络连接正常')
      process.exit(1)
    }
  } catch (error) {
    console.error('💥 测试执行出错:', error.message)
    process.exit(1)
  }
}

// 运行测试
runTests() 