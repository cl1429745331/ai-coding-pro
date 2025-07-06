# 故事影像馆 - Vercel 部署指南

## 部署前检查清单

### ✅ 已完成的准备工作

1. **代码质量检查**
   - [x] TypeScript 编译无错误
   - [x] Next.js 构建成功
   - [x] 所有依赖包版本兼容
   - [x] 图片优化配置完成

2. **配置文件**
   - [x] `vercel.json` - Vercel 部署配置
   - [x] `next.config.ts` - Next.js 配置
   - [x] `.gitignore` - 确保敏感文件被忽略
   - [x] `env.example` - 环境变量示例

## 一键部署到 Vercel

### 方法一：GitHub 连接（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备生产环境部署"
   git push origin main
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择您的 GitHub 仓库
   - 选择框架：**Next.js**

3. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://esnwratppwjemtkuzbkw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbndyYXRwcHdqZW10a3V6Ymt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDIwNDMsImV4cCI6MjA2NjE3ODA0M30.Oie9qYYYpYB4s8DRmv0RykpcqE9zTV6A1ADHo8A-ZFk
   ```

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（约 2-3 分钟）
   - 获得生产环境 URL

### 方法二：Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

## 环境变量配置详解

### 必需的环境变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGci...` |

### 可选的环境变量

| 变量名 | 描述 | 用途 |
|--------|------|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | Google Analytics ID | 网站统计 |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | Vercel Analytics | 性能监控 |

## 性能优化配置

### 已配置的优化项

1. **图片优化**
   - Next.js Image 组件
   - Unsplash 和 Supabase 域名白名单
   - 自动 WebP 转换

2. **缓存策略**
   - API 响应缓存：1小时
   - 静态资源缓存：1年
   - stale-while-revalidate 策略

3. **安全头**
   - X-Content-Type-Options
   - X-Frame-Options  
   - X-XSS-Protection
   - Referrer-Policy

4. **性能监控**
   - 函数执行时间限制：30秒
   - 自动部署优化

## 部署后验证

### 功能测试清单

- [ ] 首页加载正常
- [ ] 照片瀑布流显示
- [ ] 照片详情页可访问
- [ ] 标签筛选功能
- [ ] 响应式设计（手机/桌面）
- [ ] 图片懒加载
- [ ] 页面间导航

### 性能检查

1. **Google PageSpeed Insights**
   - 访问：https://pagespeed.web.dev/
   - 输入您的 Vercel 域名
   - 目标：桌面版 90+，移动版 80+

2. **Vercel Analytics**
   - 在 Vercel 仪表板查看性能指标
   - 监控核心网页指标（Core Web Vitals）

## 域名配置（可选）

### 添加自定义域名

1. **在 Vercel 中配置**
   - 项目设置 → Domains
   - 添加您的域名
   - 获取 DNS 配置信息

2. **DNS 配置**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## 数据库部署注意事项

### Supabase 生产环境

1. **数据导入**
   - 使用提供的 `database/import-test-data.sql`
   - 在 Supabase 控制台 SQL 编辑器中执行

2. **安全配置**
   - 确认 RLS（Row Level Security）策略
   - 检查 API 密钥权限
   - 配置存储桶权限

## 监控和维护

### 自动部署

- GitHub 推送自动触发部署
- 支持预览环境（PR 部署）
- 回滚功能可用

### 错误监控

建议集成：
- Sentry（错误追踪）
- LogRocket（用户会话重放）
- Vercel Analytics（性能监控）

## 常见问题

### Q: 部署失败怎么办？

1. 检查构建日志
2. 验证环境变量
3. 确认 Node.js 版本兼容
4. 检查依赖包版本

### Q: 图片不显示？

1. 确认 Supabase Storage 配置
2. 检查 `next.config.ts` 域名配置
3. 验证图片 URL 可访问性

### Q: 网站速度慢？

1. 启用 Vercel Analytics
2. 检查 Core Web Vitals
3. 优化图片大小
4. 使用 CDN 加速

---

## 快速部署命令

```bash
# 确保代码最新
git add .
git commit -m "生产环境部署"
git push origin main

# 或使用 Vercel CLI
vercel --prod
```

**部署成功后，您的故事影像馆将在几分钟内上线！** 