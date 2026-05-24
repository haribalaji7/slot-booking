import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@slotbooking.com')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await auth.login(email, password)
      login(res.token, res.name, res.email)
      navigate('/admin')
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-2xl mb-4">
              <LogIn className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-slate-400 mt-1">Sign in to manage your offers</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
                placeholder="admin@slotbooking.com" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
                placeholder="••••••••" required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <a href="/" className="block text-center mt-4 text-sm text-slate-500 hover:text-slate-300 transition">
            ← Back to public offers
          </a>
        </div>
      </div>
    </div>
  )
}
