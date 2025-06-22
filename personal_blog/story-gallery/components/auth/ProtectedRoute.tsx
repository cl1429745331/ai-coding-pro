'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated, refreshSession } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAdminAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (!authenticated) {
        router.push('/admin/login')
      } else {
        // 刷新会话时间
        refreshSession()
      }
    }

    checkAuth()
    
    // 每5分钟检查一次会话状态
    const interval = setInterval(checkAuth, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [router])

  // 加载状态
  if (isAuthenticated === null) {
    return (
      fallback || (
        <div className="min-h-screen bg-dark-500 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-400">验证身份中...</p>
          </div>
        </div>
      )
    )
  }

  // 未认证状态
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">需要登录</h1>
          <p className="text-gray-400 mb-6">正在跳转到登录页面...</p>
        </div>
      </div>
    )
  }

  // 已认证，显示内容
  return <>{children}</>
}

export default ProtectedRoute 