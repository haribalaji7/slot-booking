import { useState, useEffect } from 'react'
import { bookings } from '../services/api'
import type { Booking } from '../types'
import { Tickets, Search, CheckCircle, XCircle, Download } from 'lucide-react'
import { useCsvExport } from '../hooks/useCsvExport'

export default function AdminBookingsPage() {
  const [data, setData] = useState<Booking[]>([])
  const [search, setSearch] = useState('')
  const exportCsv = useCsvExport()

  useEffect(() => { bookings.getAll().then(setData) }, [])

  const filtered = data.filter(
    (b) => b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) || b.customerPhone.includes(search)
  )

  const handleStatus = async (id: string, status: string) => {
    const updated = await bookings.updateStatus(id, status)
    setData(data.map((b) => (b.id === id ? updated : b)))
  }

  const handleExport = () => {
    const headers = ['Reference', 'Customer', 'Phone', 'Offer', 'Date', 'Time', 'People', 'Status']
    const rows = filtered.map((b) => [
      b.bookingReference, b.customerName, b.customerPhone,
      b.offerTitle, new Date(b.slotDate).toLocaleDateString(),
      `${b.slotStartTime.slice(0,5)}-${b.slotEndTime.slice(0,5)}`,
      String(b.peopleCount), b.status,
    ])
    exportCsv([headers, ...rows], `bookings-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Confirmed: 'bg-emerald-500/10 text-emerald-400', Cancelled: 'bg-red-500/10 text-red-400',
      Completed: 'bg-blue-500/10 text-blue-400', Pending: 'bg-amber-500/10 text-amber-400',
      NoShow: 'bg-slate-500/10 text-slate-400',
    }
    return styles[status] || 'bg-slate-500/10 text-slate-400'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Tickets className="w-6 h-6 text-amber-400" /> Bookings
      </h1>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <div className="p-5 border-b border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Search..." />
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-700/50">
                <th className="text-left p-4">Reference</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Offer</th>
                <th className="text-left p-4">Date/Time</th>
                <th className="text-left p-4">People</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                  <td className="p-4 font-mono text-amber-400 text-xs">{b.bookingReference}</td>
                  <td className="p-4 text-white">{b.customerName}</td>
                  <td className="p-4 text-slate-400">{b.customerPhone}</td>
                  <td className="p-4 text-slate-300 max-w-[150px] truncate">{b.offerTitle}</td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(b.slotDate).toLocaleDateString()}<br/>{b.slotStartTime.slice(0,5)}-{b.slotEndTime.slice(0,5)}</td>
                  <td className="p-4 text-white">{b.peopleCount}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(b.status)}`}>{b.status}</span></td>
                  <td className="p-4">
                    {b.status === 'Confirmed' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleStatus(b.id, 'Completed')} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded" title="Complete"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => handleStatus(b.id, 'Cancelled')} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded" title="Cancel"><XCircle className="w-4 h-4" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-slate-500">No bookings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
