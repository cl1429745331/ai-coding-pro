// 测试 Supabase 连接
const { createClient } = require('@supabase/supabase-js');

// 读取环境变量
require('dotenv').config({ path: '.env.local' });

console.log('正在测试 Supabase 连接...');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key 前缀:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 环境变量缺失:');
  console.log('URL 存在:', !!supabaseUrl);
  console.log('Key 存在:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 测试连接
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase 查询错误:', error.message);
    } else {
      console.log('✅ Supabase 连接成功！');
      console.log('照片表记录数:', data);
    }
  } catch (err) {
    console.error('❌ 连接测试失败:', err.message);
  }
}

testConnection(); 