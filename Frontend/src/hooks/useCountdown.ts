import { useState, useEffect } from 'react'

export function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) { setTimeLeft('Expired'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}
