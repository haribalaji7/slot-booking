import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { offers, slots, bookings } from '../services/api'
import type { Offer, Slot } from '../types'
import { CalendarDays, Clock, Users, ArrowLeft, CheckCircle, User, Phone, Mail, MessageSquare } from 'lucide-react'

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [slotList, setSlotList] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [step, setStep] = useState<'slots' | 'form' | 'confirm'>('slots')
  const [form, setForm] = useState({ name: '', phone: '', email: '', people: 1, note: '' })
  const [confirmRef, setConfirmRef] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([offers.getById(id), slots.getAvailable(id)])
      .then(([o, s]) => { setOffer(o); setSlotList(s) })
      .finally(() => setLoading(false))
  }, [id])

  const groupedSlots = slotList.reduce<Record<string, Slot[]>>((acc, slot) => {
    const key = slot.slotDate
    if (!acc[key]) acc[key] = []
    acc[key].push(slot)
    return acc
  }, {})

  const handleBook = async () => {
    if (!offer || !selectedSlot) return
    setError('')
    try {
      const res = await bookings.create({
        offerId: offer.id, slotId: selectedSlot.id,
        customerName: form.name, customerPhone: form.phone,
        customerEmail: form.email || undefined,
        peopleCount: form.people, specialNote: form.note || undefined,
      })
      setConfirmRef(res.bookingReference)
      setStep('confirm')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!offer) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Offer not found</div>

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-semibold text-white truncate">{offer.title}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {step === 'slots' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Select a Date & Time Slot</h2>
              <p className="text-slate-400 text-sm mt-1">Choose an available slot to book</p>
            </div>
            {Object.keys(groupedSlots).length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No available slots</p>
              </div>
            ) : (
              Object.entries(groupedSlots).map(([date, slots]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <button key={slot.id} onClick={() => { setSelectedSlot(slot); setStep('form') }}
                        className={`p-3 rounded-xl border text-left transition ${
                          slot.availableCount <= 2
                            ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
                            : 'border-slate-700/50 bg-slate-800/30 hover:border-emerald-500/30'
                        }`}>
                        <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />{slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span className={`text-xs font-medium ${slot.availableCount <= 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{slot.availableCount} left</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {step === 'form' && (
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Your Details</h2>
              <p className="text-slate-400 text-sm mt-1">
                <Clock className="w-3.5 h-3.5 inline mr-1" />
                {selectedSlot && `${new Date(selectedSlot.slotDate).toLocaleDateString()} at ${selectedSlot.startTime.slice(0, 5)}`}
              </p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-500" /> Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Phone number" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> Email <span className="text-slate-600">(optional)</span></label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Email address" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> People</label>
                <input type="number" min={1} max={selectedSlot?.availableCount || 10} value={form.people}
                  onChange={(e) => setForm({ ...form, people: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Note <span className="text-slate-600">(optional)</span></label>
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none" rows={2} placeholder="Any special requests?" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button onClick={handleBook} className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition">Confirm Booking</button>
              <button onClick={() => setStep('slots')} className="w-full py-2 text-sm text-slate-400 hover:text-white transition">← Change slot</button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
            <p className="text-slate-400 mt-2">Your booking has been successfully created.</p>
            <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <div className="text-center mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-amber-400 mt-1">{confirmRef}</p>
              </div>
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-lg p-2">
                  <QRCodeSVG value={`${window.location.origin}/book/${id}?ref=${confirmRef}`} size={120} />
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-slate-700/50 pt-4 text-left">
                <div className="flex justify-between"><span className="text-slate-400">Offer</span><span className="text-white">{offer.title}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="text-white">{selectedSlot && new Date(selectedSlot.slotDate).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Time</span><span className="text-white">{selectedSlot?.startTime.slice(0, 5)} - {selectedSlot?.endTime.slice(0, 5)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white">{form.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="text-white">{form.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">People</span><span className="text-white">{form.people}</span></div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition">Browse More Offers</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
