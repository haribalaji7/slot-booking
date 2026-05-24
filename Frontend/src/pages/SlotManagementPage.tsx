import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { offers, slots } from '../services/api'
import type { Slot, Offer } from '../types'
import { Calendar, Clock, Users, Trash2, Plus, ArrowLeft } from 'lucide-react'

export default function SlotManagementPage() {
  const { id } = useParams<{ id: string }>()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [slotList, setSlotList] = useState<Slot[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', startTime: '09:00', endTime: '18:00', capacity: 10, slotDurationMinutes: 60 })
  const [viewDate, setViewDate] = useState('')

  useEffect(() => {
    if (!id) return
    offers.getById(id).then(setOffer)
    slots.getByOffer(id).then(setSlotList)
  }, [id])

  const createSlots = async () => {
    setSaving(true)
    try {
      await slots.createBulk({
        offerId: id,
        ...form,
        startTime: form.startTime + ':00',
        endTime: form.endTime + ':00'
      })
      setShowForm(false)
      setSlotList(await slots.getByOffer(id!))
    } catch (e: any) {
      const detail = e?.response?.data?.title || e?.response?.status || e?.message || 'Unknown error'
      alert(`Failed to generate slots: ${detail}`)
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const deleteSlot = async (slotId: string) => {
    if (!confirm('Delete this slot?')) return
    await slots.delete(slotId)
    setSlotList(slotList.filter((s) => s.id !== slotId))
  }

  if (!offer) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" /></div>

  const dates = [...new Set(slotList.map((s) => s.slotDate))].sort()
  const selectedDate = viewDate || dates[0] || ''
  const daySlots = slotList.filter((s) => s.slotDate === selectedDate)

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin/offers" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" /> Back to Offers
            </Link>
            <h1 className="text-2xl font-bold text-white">{offer.title} — Slots</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Generate Slots
          </button>
        </div>

        {dates.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No slots yet</p>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-64 shrink-0">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Calendar
                </h3>
                <div className="space-y-1">
                  {dates.map((d) => {
                    const dateSlots = slotList.filter((s) => s.slotDate === d)
                    const available = dateSlots.filter((s) => s.status === 'Available').length
                    return (
                      <button key={d} onClick={() => setViewDate(d)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          selectedDate === d ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}>
                        <span className="font-medium">{new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className={`ml-2 text-xs ${available === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {available}/{dateSlots.length}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-400 mb-3">
                {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              {daySlots.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No slots for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className={`p-4 rounded-xl border flex items-center justify-between ${
                      slot.status === 'Full' ? 'border-red-500/20 bg-red-500/5' :
                      slot.status === 'Available' ? 'border-slate-700/50 bg-slate-800/30' :
                      'border-slate-700/30 bg-slate-800/20 opacity-60'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full ${
                          slot.status === 'Full' ? 'bg-red-500' :
                          slot.availableCount <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2 text-white font-medium">
                            <Clock className="w-4 h-4 text-slate-500" />
                            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {slot.bookedCount}/{slot.capacity} booked</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                              slot.status === 'Available' ? 'text-emerald-400 bg-emerald-500/10' :
                              slot.status === 'Full' ? 'text-red-400 bg-red-500/10' : 'text-slate-500 bg-slate-500/10'
                            }`}>{slot.status}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteSlot(slot.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-4">Generate Slots</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-300 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div>
                <div><label className="block text-sm text-slate-300 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-300 mb-1">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div>
                <div><label className="block text-sm text-slate-300 mb-1">End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-300 mb-1">Duration (min)</label>
                  <input type="number" value={form.slotDurationMinutes} onChange={(e) => setForm({ ...form, slotDurationMinutes: +e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div>
                <div><label className="block text-sm text-slate-300 mb-1">Capacity</label>
                  <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={createSlots} disabled={saving} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-semibold rounded-lg transition">{saving ? 'Generating...' : 'Generate'}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
