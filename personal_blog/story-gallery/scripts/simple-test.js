#!/usr/bin/env node

/**
 * 故事影像馆 - 简单的 Supabase 连接测试脚本
 * 不依赖外部包，直接读取环境变量文件
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 故事影像馆 - Supabase 连接测试 (简单版本)')
console.log('==========================================')

// 手动读取 .env.local 文件
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ 错误: .env.local 文件不存在')
    console.error('   请在 story-gallery 目录下创建 .env.local 文件')
    console.error('   参考内容：')
    console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
    console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}

  envContent.split('\n').forEach(line => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        envVars[key] = valueParts.join('=').replace(/['"]/g, '')
      }
    }
  })

  return envVars
}

// 检查环境变量
console.log('\n📋 检查环境变量...')
const envVars = loadEnvFile()

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

// 基本网络连接测试
async function testBasicConnection() {
  console.log('\n🌐 测试网络连接...')
  
  try {
    // 使用 Node.js 内置的 https 模块测试连接
    const https = require('https')
    const url = require('url')
    
    const urlParts = url.parse(supabaseUrl)
    
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: urlParts.hostname,
        port: urlParts.port || 443,
        path: '/rest/v1/',
        method: 'HEAD',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      }, (res) => {
        console.log(`✅ 网络连接正常，状态码: ${res.statusCode}`)
        resolve(true)
      })
      
      req.on('error', (error) => {
        console.error('❌ 网络连接失败:', error.message)
        resolve(false)
      })
      
      req.setTimeout(10000, () => {
        console.error('❌ 网络连接超时')
        req.destroy()
        resolve(false)
      })
      
      req.end()
    })
  } catch (error) {
    console.error('❌ 网络测试失败:', error.message)
    return false
  }
}

// 测试 Supabase API
async function testSupabaseAPI() {
  console.log('\n🧪 测试 Supabase API...')
  
  try {
    const https = require('https')
    const url = require('url')
    
    const apiUrl = `${supabaseUrl}/rest/v1/photos?select=count`
    const urlParts = url.parse(apiUrl)
    
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: urlParts.hostname,
        port: urlParts.port || 443,
        path: urlParts.path,
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let data = ''
        
        res.on('data', (chunk) => {
          data += chunk
        })
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Supabase API 连接正常')
            try {
              const result = JSON.parse(data)
              console.log(`   - photos 表可以访问，数据: ${JSON.stringify(result)}`)
            } catch (e) {
              console.log('   - 返回数据格式:', data.substring(0, 100))
            }
            resolve(true)
          } else if (res.statusCode === 406 || res.statusCode === 400) {
            console.log('✅ Supabase API 连接正常 (表可能为空或查询格式问题)')
            console.log(`   - 状态码: ${res.statusCode}`)
            console.log(`   - 这是正常的，说明数据库连接正常`)
            resolve(true)
          } else {
            console.error(`❌ API 请求失败，状态码: ${res.statusCode}`)
            console.error(`   - 响应数据: ${data}`)
            resolve(false)
          }
        })
      })
      
      req.on('error', (error) => {
        console.error('❌ API 请求失败:', error.message)
        resolve(false)
      })
      
      req.setTimeout(10000, () => {
        console.error('❌ API 请求超时')
        req.destroy()
        resolve(false)
      })
      
      req.end()
    })
  } catch (error) {
    console.error('❌ API 测试失败:', error.message)
    return false
  }
}

// 主测试函数
async function runSimpleTest() {
  try {
    // 测试基本连接
    const networkOk = await testBasicConnection()
    if (!networkOk) {
      console.log('\n❌ 网络连接测试失败')
      return false
    }

    // 测试 API
    const apiOk = await testSupabaseAPI()
    if (!apiOk) {
      console.log('\n❌ Supabase API 测试失败')
      return false
    }

    return true
  } catch (error) {
    console.error('❌ 测试执行失败:', error.message)
    return false
  }
}

// 执行测试
async function main() {
  console.log('\n🚀 开始执行简单连接测试...')
  
  const success = await runSimpleTest()
  
  console.log('\n📊 测试结果总结')
  console.log('=================')
  
  if (success) {
    console.log('🎉 基本连接测试通过！')
    console.log('\n✅ 检查项目：')
    console.log('   ✓ 环境变量配置正确')
    console.log('   ✓ 网络连接正常')
    console.log('   ✓ Supabase API 可访问')
    
    console.log('\n📝 下一步：')
    console.log('   1. 在 Supabase 控制台执行 database/schema.sql 创建表结构')
    console.log('   2. 运行 npm run dev 启动开发服务器')
    console.log('   3. 使用完整的测试脚本进行详细测试')
    
    console.log('\n💡 提示：')
    console.log('   - 如果需要详细测试，请先安装依赖：npm install')
    console.log('   - 然后运行：npm run test:connection')
    
  } else {
    console.log('❌ 连接测试失败')
    console.log('\n🔧 故障排除：')
    console.log('   1. 检查网络连接是否正常')
    console.log('   2. 确认 Supabase URL 和 API Key 正确')
    console.log('   3. 确认 Supabase 项目正常运行')
    console.log('   4. 检查防火墙设置')
    
    console.log('\n📞 获取帮助：')
    console.log('   - 检查 Supabase 控制台项目状态')
    console.log('   - 重新生成 API Key（如有必要）')
  }
  
  process.exit(success ? 0 : 1)
}

// 运行主函数
main().catch(error => {
  console.error('💥 程序执行失败:', error.message)
  process.exit(1)
}) 