import { useState, useEffect } from 'react'
import { bookings } from '../services/api'
import type { Dashboard as DashboardType, Booking } from '../types'
import { LayoutDashboard, Tag, CalendarCheck, Users, TrendingUp, Search } from 'lucide-react'

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardType | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    bookings.getDashboard().then(setDashboard)
    bookings.getAll().then(setRecentBookings)
  }, [])

  const filtered = recentBookings.filter(
    (b) =>
      b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search)
  )

  const stats = dashboard ? [
    { label: 'Total Offers', value: dashboard.totalOffers, icon: Tag, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Active Offers', value: dashboard.activeOffers, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Bookings', value: dashboard.totalBookings, icon: CalendarCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: "Today's Bookings", value: dashboard.todayBookings, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ] : []

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Confirmed: 'bg-emerald-500/10 text-emerald-400',
      Cancelled: 'bg-red-500/10 text-red-400',
      Completed: 'bg-blue-500/10 text-blue-400',
      Pending: 'bg-amber-500/10 text-amber-400',
      NoShow: 'bg-slate-500/10 text-slate-400',
    }
    return styles[status] || 'bg-slate-500/10 text-slate-400'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-amber-400" /> Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {dashboard && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Slot Utilization</p>
              <p className="text-3xl font-bold text-white">{dashboard.conversionRate}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(dashboard.conversionRate, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <div className="p-5 border-b border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              placeholder="Search bookings..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-700/50">
                <th className="text-left p-4">Reference</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">People</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                  <td className="p-4 font-mono text-amber-400 text-xs">{b.bookingReference}</td>
                  <td className="p-4 text-white">{b.customerName}</td>
                  <td className="p-4 text-slate-400">{b.customerPhone}</td>
                  <td className="p-4 text-white">{b.peopleCount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
