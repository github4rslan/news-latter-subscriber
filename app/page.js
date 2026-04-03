'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle } from 'lucide-react'

const RECENT_SUBSCRIBERS = [
  { name: 'Omar', location: 'Dubai, UAE' },
  { name: 'Fatima', location: 'Riyadh, KSA' },
  { name: 'Khalid', location: 'London, UK' },
  { name: 'Aisha', location: 'Toronto, CA' },
  { name: 'Yusuf', location: 'Jeddah, KSA' },
  { name: 'Noor', location: 'Amsterdam, NL' },
  { name: 'Ibrahim', location: 'New York, US' },
  { name: 'Mariam', location: 'Singapore' },
  { name: 'Abdullah', location: 'Riyadh, KSA' },
  { name: 'Zainab', location: 'Manama, BH' },
  { name: 'Tariq', location: 'Abu Dhabi, UAE' },
  { name: 'Layla', location: 'Paris, FR' },
  { name: 'Hassan', location: 'Kuwait City, KW' },
  { name: 'Rania', location: 'Doha, QA' },
  { name: 'Saad', location: 'Makkah, KSA' },
  { name: 'Khadija', location: 'Amman, JO' },
  { name: 'Faris', location: 'Sydney, AU' },
  { name: 'Hafsa', location: 'Berlin, DE' },
  { name: 'Walid', location: 'Madinah, KSA' },
  { name: 'Samira', location: 'Cairo, EG' },
  { name: 'Nawaf', location: 'Houston, US' },
  { name: 'Ruqayyah', location: 'Stockholm, SE' },
  { name: 'Majid', location: 'Dammam, KSA' },
  { name: 'Sumayya', location: 'Kuala Lumpur, MY' },
  { name: 'Hamad', location: 'Doha, QA' },
  { name: 'Noura', location: 'Dubai, UAE' },
  { name: 'Bilal', location: 'Kuwait City, KW' },
  { name: 'Hessa', location: 'Abu Dhabi, UAE' },
  { name: 'Sami', location: 'Jeddah, KSA' },
  { name: 'Maryam', location: 'London, UK' },
  { name: 'Jassim', location: 'Doha, QA' },
  { name: 'Reem', location: 'Toronto, CA' },
  { name: 'Turki', location: 'Riyadh, KSA' },
  { name: 'Asma', location: 'Dubai, UAE' },
  { name: 'Nasser', location: 'Sharjah, UAE' },
  { name: 'Ghada', location: 'Amsterdam, NL' },
  { name: 'Rashid', location: 'Dubai, UAE' },
  { name: 'Iman', location: 'Manchester, UK' },
  { name: 'Salman', location: 'Manama, BH' },
  { name: 'Dalal', location: 'New York, US' },
  { name: 'Faisal', location: 'Riyadh, KSA' },
  { name: 'Haifa', location: 'Paris, FR' },
  { name: 'Yousef', location: 'Muscat, OM' },
  { name: 'Wafa', location: 'Dubai, UAE' },
  { name: 'Meshal', location: 'Kuwait City, KW' },
  { name: 'Arwa', location: 'Melbourne, AU' },
  { name: 'Ziad', location: 'Beirut, LB' },
  { name: 'Manal', location: 'Singapore' },
  { name: 'Sultan', location: 'Abu Dhabi, UAE' },
  { name: 'Hind', location: 'London, UK' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function SubscriberToast() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const shuffled = useRef(shuffle(RECENT_SUBSCRIBERS))

  useEffect(() => {
    // First toast after 4 seconds
    const initial = setTimeout(() => showToast(), 4000)
    return () => clearTimeout(initial)
  }, [])

  function showToast() {
    setVisible(true)
    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(i => {
          const next = i + 1
          if (next >= shuffled.current.length) {
            shuffled.current = shuffle(RECENT_SUBSCRIBERS)
            return 0
          }
          return next
        })
        const delay = 10000 + Math.random() * 5000
        setTimeout(() => showToast(), delay)
      }, 400)
    }, 8000)
  }

  const sub = shuffled.current[current]

  return (
    <div
      className="fixed bottom-6 left-4 sm:left-6 z-50"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(130%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
      }}
    >
      <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl max-w-[280px]">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-black font-bold text-sm">{sub.name.charAt(0)}</span>
        </div>
        {/* Text */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium">New subscriber</p>
          </div>
          <p className="text-white text-sm font-semibold leading-tight">
            Welcome, {sub.name}! 🎉
          </p>
          <p className="text-gray-400 text-xs mt-0.5">{sub.location} · joined today</p>
        </div>
      </div>
    </div>
  )
}

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
  { initials: 'AK', bg: '#C9A84C' },
  { initials: 'SR', bg: '#1B4332' },
  { initials: 'MF', bg: '#1A1208' },
  { initials: 'NJ', bg: '#7C3F00' },
]

export default function NewsletterLanding() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
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

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSuccess(true)
      setSubscriberCount(c => (c ?? 2847) + 1)
      setFormData({ firstName: '', lastName: '', email: '' })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SubscriberToast />
      {/* HERO SECTION */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-5 sm:px-6 py-8 sm:py-12">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl w-full text-center">
          <h1 className="text-[2rem] sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-5 leading-tight tracking-tight">
            The Saudi Entry Strategy
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto px-0">
            Vision 2030 is rewriting the rules. $3 trillion in projects. New cities rising. Visa gates opening. Every Tuesday and Friday, get the opportunities worth acting on. Distilled to 5 minutes, zero noise.
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-400/40 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-200 font-semibold text-sm">Successfully subscribed!</p>
                  <p className="text-green-300/80 text-xs">Check your email for confirmation.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-400/40 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="max-w-md mx-auto mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
              placeholder="your@email.com"
              disabled={loading}
              className="w-full px-6 py-4 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/70 focus:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center backdrop-blur-sm text-base sm:text-lg"
              style={{ fontSize: '16px' }}
              required
            />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full max-w-md mx-auto block py-4 px-8 bg-white hover:bg-gray-100 text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4 sm:mb-6 text-base sm:text-lg cta-pulse min-h-[48px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining...
              </span>
            ) : (
              'Get My First Brief'
            )}
          </button>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-semibold text-xs"
                  style={{ backgroundColor: a.bg }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm text-center">
              <span className="text-white font-semibold">
                {subscriberCount === null ? '...' : animatedCount.toLocaleString()}
              </span>
              {' '}professionals already inside. Drops every Tuesday & Friday.
            </p>
          </div>
        </div>
      </section>

      {/* BONUS SECTION */}
      <section className="bg-gray-950 px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Founding Member Bonus
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Free for founding members
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
            Your Personalized Saudi Opportunity Map — a 10-page guide built from your goals (invest, relocate, build, or explore). Delivered on signup.
          </p>
        </div>
      </section>
    </div>
  )
}
