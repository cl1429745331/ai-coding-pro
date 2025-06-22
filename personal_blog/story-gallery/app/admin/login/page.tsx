'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { verifyAdminLogin, isAdminAuthenticated } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // 如果已经登录，直接跳转到管理后台
    if (isAdminAuthenticated()) {
      router.push('/admin')
    }
  }, [router])

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    return await verifyAdminLogin(username, password)
  }

  return <LoginForm onLogin={handleLogin} />
} 