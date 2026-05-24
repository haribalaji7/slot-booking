import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { offers } from '../services/api'
import type { Offer } from '../types'
import { Tag, Clock, Percent, ArrowRight, Filter } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import FilterSidebar from '../components/FilterSidebar'

interface Filters { category: string; businessType: string; date: string; minPrice: string; maxPrice: string; availableOnly: boolean }

export default function PublicOffersPage() {
  const [data, setData] = useState<Offer[]>([])
  const [filteredData, setFilteredData] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ category: '', businessType: '', date: '', minPrice: '', maxPrice: '', availableOnly: false })
  const [allBusinessTypes, setAllBusinessTypes] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    offers.getAll({ status: 'Active' }).then((res) => {
      setData(res)
      applyFilters(res, filters)
      const types = [...new Set((res as Offer[]).map((o: Offer) => o.businessName))]
      setAllBusinessTypes(types)
    }).finally(() => setLoading(false))
  }, [])

  const applyFilters = (items: Offer[], f: Filters) => {
    let result = [...items]
    if (f.category) result = result.filter((o) => o.category === f.category)
    if (f.businessType) result = result.filter((o) => o.businessName === f.businessType)
    if (f.date) {
      const d = new Date(f.date)
      result = result.filter((o) => new Date(o.startDate) <= d && new Date(o.endDate) >= d)
    }
    if (f.minPrice) result = result.filter((o) => o.offerPrice >= +f.minPrice)
    if (f.maxPrice) result = result.filter((o) => o.offerPrice <= +f.maxPrice)
    if (f.availableOnly) result = result.filter((o) => o.availableSlots > 0)
    setFilteredData(result)
  }

  const handleApply = () => applyFilters(data, filters)

  const categories = [...new Set(data.map((o) => o.category))]

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            <Tag className="w-5 h-5 inline mr-2 text-amber-400" />
            Smart Offers
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => document.getElementById('filter-btn')?.click()}
              className="lg:hidden p-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg"
            >
              <Filter className="w-4 h-4" />
            </button>
            <a href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-700 rounded-lg transition">
              Admin
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div id="filter-btn">
            <FilterSidebar
              categories={categories}
              businessTypes={allBusinessTypes}
              filters={filters}
              onChange={setFilters}
              onApply={handleApply}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => { setFilters({ ...filters, category: '' }); handleApply() }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${!filters.category ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>All</button>
              {categories.map((c) => (
                <button key={c} onClick={() => { setFilters({ ...filters, category: c }); handleApply() }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filters.category === c ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{c}</button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="bg-slate-800/50 rounded-xl h-72 animate-pulse" />)}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No offers match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} onBook={() => navigate(`/book/${offer.id}`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function OfferCard({ offer, onBook }: { offer: Offer; onBook: () => void }) {
  const countdown = useCountdown(offer.endDate)

  return (
    <div className="group bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
      <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
        {offer.imageUrl ? (
          <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Tag className="w-12 h-12 text-slate-600" /></div>
        )}
        <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Percent className="w-3.5 h-3.5" />{offer.discountPercentage}% OFF
        </div>
        <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
          {offer.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition">{offer.title}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{offer.description}</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold text-amber-400">₹{offer.offerPrice}</span>
          <span className="text-sm text-slate-500 line-through">₹{offer.originalPrice}</span>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className={countdown === 'Expired' ? 'text-red-400' : 'text-emerald-400'}>{countdown}</span>
        </div>
        <button onClick={onBook} className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition flex items-center justify-center gap-2">
          Book Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
