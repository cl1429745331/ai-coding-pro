// 简单的认证管理系统
// 在实际生产环境中，应该使用更安全的认证方案

interface AdminSession {
  isAuthenticated: boolean
  username: string
  loginTime: number
}

// 模拟管理员账户（生产环境应使用环境变量）
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

// 会话存储键
const SESSION_KEY = 'story_gallery_admin_session'

// 会话过期时间（24小时）
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000

// 验证管理员登录
export const verifyAdminLogin = async (username: string, password: string): Promise<boolean> => {
  // 模拟异步验证过程
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // 创建会话
    const session: AdminSession = {
      isAuthenticated: true,
      username,
      loginTime: Date.now()
    }
    
    // 存储到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
    
    return true
  }
  
  return false
}

// 检查是否已登录
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return false
    
    const session: AdminSession = JSON.parse(sessionData)
    
    // 检查会话是否过期
    if (Date.now() - session.loginTime > SESSION_TIMEOUT) {
      localStorage.removeItem(SESSION_KEY)
      return false
    }
    
    return session.isAuthenticated
  } catch (error) {
    console.error('Session check error:', error)
    return false
  }
}

// 获取管理员信息
export const getAdminSession = (): AdminSession | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return null
    
    const session: AdminSession = JSON.parse(sessionData)
    
    // 检查会话是否过期
    if (Date.now() - session.loginTime > SESSION_TIMEOUT) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

// 管理员登出
export const adminLogout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

// 更新会话时间
export const refreshSession = (): void => {
  const session = getAdminSession()
  if (session) {
    session.loginTime = Date.now()
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
} 