import { useState, useEffect } from 'react'
import { offers, businesses } from '../services/api'
import type { Offer, Business } from '../types'
import { Link } from 'react-router-dom'
import { Tag, Plus, Edit3, Trash2, X, Percent, Calendar, Clock } from 'lucide-react'

export default function AdminOffersPage() {
  const [data, setData] = useState<Offer[]>([])
  const [businessesList, setBusinessesList] = useState<Business[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([offers.getAll(), businesses.getAll()]).then(([o, b]) => {
      setData(o); setBusinessesList(b)
    }).finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({
      businessId: businessesList[0]?.id || '',
      title: '', description: '', category: 'Restaurant',
      originalPrice: 0, offerPrice: 0,
      startDate: '', endDate: '',
      termsAndConditions: '', imageUrl: '',
      status: 'Active'
    })
    setShowForm(true)
  }

  const openEdit = (offer: Offer) => {
    setEditing(offer)
    setForm({
      businessId: offer.businessId,
      title: offer.title, description: offer.description,
      category: offer.category, originalPrice: offer.originalPrice,
      offerPrice: offer.offerPrice, startDate: offer.startDate,
      endDate: offer.endDate, termsAndConditions: offer.termsAndConditions || '',
      imageUrl: offer.imageUrl || '',
      status: offer.status
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (editing) {
      const updated = await offers.update(editing.id, form)
      setData(data.map((o) => (o.id === editing.id ? updated : o)))
    } else {
      const created = await offers.create(form)
      setData([created, ...data])
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return
    await offers.delete(id)
    setData(data.filter((o) => o.id !== id))
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Active: 'bg-emerald-500/10 text-emerald-400',
      Draft: 'bg-slate-500/10 text-slate-400',
      Paused: 'bg-amber-500/10 text-amber-400',
      Expired: 'bg-red-500/10 text-red-400',
      Cancelled: 'bg-slate-500/10 text-slate-400',
    }
    return styles[status] || 'bg-slate-500/10 text-slate-400'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Tag className="w-6 h-6 text-amber-400" /> Offers
        </h1>
        <button onClick={openCreate} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Offer
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-800/30 rounded-lg animate-pulse" />)}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No offers yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((offer) => (
            <div key={offer.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-600/50 transition">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium truncate">{offer.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(offer.status)}`}>{offer.status}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Percent className="w-3 h-3" />{offer.discountPercentage}% off</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}</span>
                  <span>{offer.totalSlots} slots</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/admin/offers/${offer.id}/slots`} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition" title="Manage Slots">
                  <Clock className="w-4 h-4" />
                </Link>
                <button onClick={() => openEdit(offer)} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(offer.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Offer' : 'New Offer'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none" rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {['Restaurant', 'Gym', 'Turf', 'Spa', 'Salon', 'Cafe', 'Other'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Business</label>
                  <select value={form.businessId} onChange={(e) => setForm({ ...form, businessId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {businessesList.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {['Draft', 'Active'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: +e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Offer Price (₹)</label>
                  <input type="number" value={form.offerPrice} onChange={(e) => setForm({ ...form, offerPrice: +e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Terms & Conditions</label>
                <textarea value={form.termsAndConditions} onChange={(e) => setForm({ ...form, termsAndConditions: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none" rows={2}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition">
                  {editing ? 'Update Offer' : 'Create Offer'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
