# 故事影像馆

基于 Next.js + Supabase + Tailwind CSS 的现代化照片分享平台。

## 技术栈

- **Next.js 15** - React 框架
- **Supabase** - 后端即服务
- **Tailwind CSS** - 样式框架
- **TypeScript** - 类型安全

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.local.example .env.local
```

3. 编辑 `.env.local` 文件，填入你的 Supabase 配置

4. 启动开发服务器：
```bash
npm run dev
```

5. 访问 http://localhost:3000

## 项目结构

```
story-gallery/
├── app/              # Next.js App Router
├── components/       # React 组件
├── lib/             # 工具库
└── public/          # 静态资源
``` 