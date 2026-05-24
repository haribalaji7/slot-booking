import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthState {
  token: string | null
  name: string | null
  email: string | null
  login: (token: string, name: string, email: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthState>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [name, setName] = useState<string | null>(localStorage.getItem('name'))
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))

  const login = (t: string, n: string, e: string) => {
    localStorage.setItem('token', t)
    localStorage.setItem('name', n)
    localStorage.setItem('email', e)
    setToken(t); setName(n); setEmail(e)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    setToken(null); setName(null); setEmail(null)
  }

  return (
    <AuthContext.Provider value={{ token, name, email, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
