import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

interface Filters {
  category: string
  businessType: string
  date: string
  minPrice: string
  maxPrice: string
  availableOnly: boolean
}

interface Props {
  categories: string[]
  businessTypes: string[]
  filters: Filters
  onChange: (f: Filters) => void
  onApply: () => void
}

export default function FilterSidebar({ categories, businessTypes, filters, onChange, onApply }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition lg:hidden"
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters
      </button>

      <div className="hidden lg:block w-64 shrink-0">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 space-y-5 sticky top-24">
          <FilterContent {...{ categories, businessTypes, filters, onChange }} />
          <button onClick={onApply} className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition text-sm">
            Apply Filters
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-slate-700/50 p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filters
              </h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent {...{ categories, businessTypes, filters, onChange }} />
            <button
              onClick={() => { onApply(); setOpen(false) }}
              className="w-full mt-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function FilterContent({ categories, businessTypes, filters, onChange }: Omit<Props, 'onApply'>) {
  const upd = (partial: Partial<Filters>) => onChange({ ...filters, ...partial })

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Category</label>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => upd({ category: '' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${!filters.category ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => upd({ category: c })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${filters.category === c ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Business Type</label>
        <select value={filters.businessType} onChange={(e) => upd({ businessType: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50">
          <option value="">All Types</option>
          {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Date</label>
        <input type="date" value={filters.date} onChange={(e) => upd({ date: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Price Range</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => upd({ minPrice: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-slate-500" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => upd({ maxPrice: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-slate-500" />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={filters.availableOnly} onChange={(e) => upd({ availableOnly: e.target.checked })}
          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50" />
        <span className="text-sm text-slate-300">Available only</span>
      </label>
    </>
  )
}
