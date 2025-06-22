# Supabase设置指南

## 1. 创建Supabase项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册并登录账户
3. 点击 "New project" 创建新项目
4. 选择组织，输入项目名称，数据库密码和区域
5. 点击 "Create new project" 创建项目

## 2. 获取项目配置信息

1. 在项目仪表板中，点击左侧 "Settings" -> "API"
2. 复制以下信息：
   - Project URL
   - anon/public key
   - service_role key (谨慎使用)

## 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名公钥
SUPABASE_SERVICE_ROLE_KEY=你的服务角色密钥

# 其他环境变量
NEXTAUTH_SECRET=你的认证密钥
NEXTAUTH_URL=http://localhost:3000
```

## 4. 测试连接

项目启动后，如果Supabase配置正确，控制台不会出现警告信息。

## 注意事项

- `.env.local` 文件不应提交到版本控制系统
- `SUPABASE_SERVICE_ROLE_KEY` 具有管理员权限，仅在服务端使用
- 开发环境和生产环境需要分别配置不同的Supabase项目 