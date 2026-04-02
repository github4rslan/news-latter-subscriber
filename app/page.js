'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, MapPin, TrendingUp, Briefcase } from 'lucide-react'

function useCountUp(target, duration = 1200) {
  const [display, setDisplay] = useState(target)
  const prev = useRef(target)

  useEffect(() => {
    if (prev.current === target) return
    const start = prev.current
    const diff = target - start
    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(tick)
      else prev.current = target
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return display
}

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=d1f4d1',
]

export default function NewsletterLanding() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [subscriberCount, setSubscriberCount] = useState(null)
  const animatedCount = useCountUp(subscriberCount ?? 0)

  useEffect(() => {
    fetch('/api/subscriber-count')
      .then(r => r.json())
      .then(d => setSubscriberCount(d.count))
      .catch(() => setSubscriberCount(2847))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: '', lastName: '' })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to subscribe')
      setSuccess(true)
      setSubscriberCount(c => (c ?? 2847) + 1)
      setEmail('')
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-5 py-16 sm:py-20">

        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-xl text-center mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-semibold tracking-widest uppercase">Saudi Arabia's Weekly Intelligence Brief</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
            The Saudi<br />Entry Strategy
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-md mx-auto">
            Vision 2030 is rewriting the rules. $3 trillion in projects. Every <span className="text-white font-medium">Tuesday & Friday</span>, get the opportunities worth acting on — distilled to 5 minutes.
          </p>

          {/* Success */}
          {success && (
            <div className="mb-5 bg-green-500/15 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-green-200 font-semibold text-sm">You're in!</p>
                  <p className="text-green-300/70 text-xs">Check your inbox for a welcome email.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-500/15 border border-red-400/30 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-3 mb-6">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={loading}
              style={{ fontSize: '16px' }}
              className="w-full px-5 py-4 bg-white/10 border border-white/25 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all disabled:opacity-50 backdrop-blur-sm text-center"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-gray-100 active:scale-[0.98] text-black font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base cta-pulse min-h-[52px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Joining...
                </span>
              ) : 'Get My First Brief — Free'}
            </button>
          </form>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <div className="flex -space-x-2.5">
              {AVATARS.map((src, i) => (
                <img key={i} src={src} alt="subscriber" className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10" />
              ))}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              <span className="text-white font-semibold">
                {subscriberCount === null ? '...' : animatedCount.toLocaleString()}
              </span>
              {' '}professionals already inside
            </p>
            <span className="hidden sm:inline text-gray-600">·</span>
            <p className="text-gray-500 text-xs">Drops every Tue & Fri</p>
          </div>

        </div>
      </section>

      {/* ── BONUS SECTION ── */}
      <section className="bg-gray-950 px-5 py-16 sm:py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-3">
            Founding Member Bonus
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Free for founding members
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-lg mx-auto mb-10 text-sm sm:text-base">
            Your Personalized Saudi Opportunity Map — a 10-page guide built around your goals. Delivered instantly on signup.
          </p>

          {/* Feature bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto">
            {[
              { icon: MapPin, title: 'Relocate', desc: 'Best neighbourhoods, visa routes & cost of living breakdowns' },
              { icon: TrendingUp, title: 'Invest', desc: 'Sectors growing fastest under Vision 2030' },
              { icon: Briefcase, title: 'Build', desc: 'Business setup, licensing & funding landscape' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-semibold text-sm">{title}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
