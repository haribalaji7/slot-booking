import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Tag, LogOut, Tickets } from 'lucide-react'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/offers', label: 'Offers', icon: Tag },
  { path: '/admin/bookings', label: 'Bookings', icon: Tickets },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { logout, name } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-64 bg-slate-900/50 border-r border-white/5 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Admin Panel</h2>
          <p className="text-sm text-slate-500 mt-0.5">{name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === item.path
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400 transition w-full rounded-lg hover:bg-slate-800/50">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden border-b border-white/5 bg-slate-900/50 backdrop-blur-xl p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Admin Panel</h2>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  pathname === item.path ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button onClick={handleLogout} className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-400">Exit</button>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
