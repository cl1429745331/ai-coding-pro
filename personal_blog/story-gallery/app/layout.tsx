import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '故事影像馆 - 专业摄影作品展示',
  description: '每张照片都有它的故事。专业摄影作品展示平台，融合艺术展示、技术分享、故事讲述的沉浸式摄影博客。',
  keywords: '摄影, 照片, 艺术, 故事, 影像, 图片展示',
  authors: [{ name: '故事影像馆' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0F0F0F] text-white antialiased" suppressHydrationWarning={true}>
        {/* 导航栏 */}
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">故事影像馆</h1>
              </div>
              
              {/* 桌面端导航 */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="/" className="nav-link active">首页</a>
                  <a href="/series" className="nav-link">系列</a>
                  <a href="/about" className="nav-link">关于</a>
                </div>
              </div>
              
              {/* 移动端菜单按钮 */}
              <div className="md:hidden">
                <button className="btn-icon">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* 主内容 */}
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
} 