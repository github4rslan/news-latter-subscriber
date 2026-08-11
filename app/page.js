'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const SAMPLE_ISSUE_URL = process.env.NEXT_PUBLIC_SAMPLE_ISSUE_URL || '/sample'

const FAQ_ITEMS = [
  {
    q: 'Is The Kingdom Edit free?',
    a: 'Yes. The core newsletter is free.',
  },
  {
    q: 'How often is it published?',
    a: 'Every Tuesday and Friday, at 8am GMT.',
  },
  {
    q: 'What topics do you cover?',
    a: 'Real estate, business setup and licensing, investment structures, visa and residency pathways, PIF and government tenders, technology and AI developments, and more.',
  },
  {
    q: 'Is this relevant to non-Muslim readers?',
    a: 'Yes. Saudi Arabia\'s economic transformation is governed by commercial and regulatory frameworks open to all nationalities and faiths. We cover opportunity and process, not religious context.',
  },
  {
    q: 'How do I unsubscribe?',
    a: 'One click, at the bottom of every email. No follow-up required.',
  },
]

function trackConversion() {
  if (typeof window === 'undefined') return

  if (window.gtag) {
    window.gtag('event', 'newsletter_subscribe', {
      event_category: 'conversion',
      event_label: 'landing_page',
    })
  }

  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'newsletter_subscribe',
      event_category: 'conversion',
    })
  }
}

function SubscribeForm({ buttonLabel, formId = 'subscribe-form' }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      trackConversion()
      setSuccess(true)
      setEmail('')

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      {success && (
        <div className="mb-4 bg-green-500/20 border border-green-400/40 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-green-200 font-semibold text-sm">You&apos;re subscribed!</p>
              <p className="text-green-300/80 text-xs">Check your inbox for a welcome email.</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-400/40 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-red-200 text-sm text-center">{error}</p>
        </div>
      )}

      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={loading}
        autoComplete="email"
        inputMode="email"
        className="w-full px-5 py-3.5 sm:py-4 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/70 focus:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center backdrop-blur-sm text-base min-h-[48px]"
        style={{ fontSize: '16px' }}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-3 py-3.5 sm:py-4 px-8 bg-white hover:bg-gray-100 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base min-h-[48px]"
      >
        {loading ? 'Subscribing...' : buttonLabel}
      </button>
    </form>
  )
}

function Section({ id, headline, children, className = '' }) {
  return (
    <section id={id} className={`px-5 sm:px-6 py-14 sm:py-16 border-t border-white/5 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">{headline}</h2>
        {children}
      </div>
    </section>
  )
}

export default function NewsletterLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* HERO - headline + CTA visible above the fold */}
      <section className="relative h-[100svh] max-h-[820px] flex flex-col justify-start pt-[13svh] pb-6 px-5 sm:px-6 sm:justify-center sm:py-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />

        <div className="relative z-10 max-w-2xl w-full mx-auto text-center">
          <h1 className="text-[1.875rem] sm:text-4xl md:text-[2.75rem] font-bold text-white mb-3 sm:mb-4 leading-[1.15] tracking-tight">
            The World&apos;s Attention Is Shifting. Saudi Arabia Is Where It&apos;s Landing.
          </h1>

          <p className="text-sm sm:text-lg text-gray-200 leading-relaxed mb-5 sm:mb-6 max-w-xl mx-auto">
            Twice a week, we read the portals, filings, briefings, and Arabic-language sources, so you
            receive only what matters. One email. Five minutes. No noise.
          </p>

          <SubscribeForm buttonLabel="Subscribe Free" formId="hero-subscribe" />
        </div>
      </section>

      {/* WHY THIS EXISTS */}
      <Section headline="The Opportunity Is Here. The Information Is Scattered.">
        <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            Vision 2030 has set a $3 trillion economy in motion. New cities. New visas. New investment
            structures. New regulatory frameworks.
          </p>
          <p>The information exists. But it lives across:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Government portals in Arabic and English, often with conflicting translations</li>
            <li>Regulatory filings with no plain-language summary</li>
            <li>Private investor briefings most people never see</li>
            <li>News coverage that reports announcements without context</li>
          </ul>
          <p>
            The Kingdom Edit collects, verifies, and distills.
            <br />
            We do the reading. You make the decisions.
          </p>
        </div>
      </Section>

      {/* WHAT YOU RECEIVE */}
      <Section headline="Tuesday and Friday. 8am GMT.">
        <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4">
          <p>Each issue contains:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              One lead story: the development, policy shift, or market movement that changes the
              landscape
            </li>
            <li>
              Two supporting signals: regulatory updates, competitor moves, or data releases that
              provide context
            </li>
            <li>
              One practical note: a deadline, a contact, a form, or an event worth your attention
            </li>
          </ul>
          <p>No commentary for commentary&apos;s sake. No speculation. No noise.</p>
        </div>
      </Section>

      {/* WHO READS THIS */}
      <Section headline="Built for People Making Real Decisions.">
        <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Investors tracking pre-construction cycles, PIF co-investment structures, and sector
              openings
            </li>
            <li>
              Entrepreneurs navigating licensing, local partnerships, and tender opportunities
            </li>
            <li>
              Professionals evaluating relocation, visa pathways, and career transitions
            </li>
            <li>
              Advisors who need credible, current intelligence for client conversations
            </li>
          </ul>
          <p>
            Read by individuals and teams across London, Dubai, New York, Riyadh, and Singapore.
          </p>
        </div>
      </Section>

      {/* A NOTE ON APPROACH */}
      <Section headline="We Report What Is. You Decide What to Do With It.">
        <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            The Kingdom Edit is a filter. We track primary sources. We verify claims. We note where
            official statements diverge from ground-level reality. We flag opportunities early and point
            out where caution is warranted.
          </p>
          <p className="text-white font-medium">Our only bias is clarity.</p>
        </div>
      </Section>

      {/* SAMPLE WORK */}
      <Section headline="See the Standard.">
        <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4">
          <p className="text-white font-semibold">Issue #87 · June 2026</p>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              Al Alyaa District, Knowledge Economic City: Construction at 70%, handover Q1 2027.
              Updated payment structure for non-Saudi buyers. What changed, and what to confirm
              before signing.
            </li>
            <li>
              SDAIA Hexagon Data Centre: 480MW capacity, EPC contract awarded. Implications for AI
              infrastructure entrants.
            </li>
            <li>
              Practical note: Wafi registration deadline this month. Direct link and required
              documentation.
            </li>
          </ul>
          <Link
            href={SAMPLE_ISSUE_URL}
            className="inline-flex items-center justify-center min-h-[48px] mt-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Read a Recent Issue
          </Link>
        </div>
      </Section>

      {/* ABOUT */}
      <Section headline="Curated by People Inside the Market.">
        <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            The Kingdom Edit is produced by a team with direct experience in Saudi real estate
            transactions, cross-border infrastructure, and regulatory navigation. It began as a private
            briefing shared with executives entering the Kingdom. Demand grew. The briefing opened.
          </p>
          <p>
            We write for readers who know the difference between an announcement and an opportunity.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section headline="Frequently Asked Questions">
        <div className="space-y-6">
          {FAQ_ITEMS.map(({ q, a }) => (
            <div key={q} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-2">{q}</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section id="subscribe" headline="Stay Informed. Stay Ahead." className="bg-black">
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
          Subscribe to The Kingdom Edit. Receive the briefing that keeps you current without keeping
          you busy.
        </p>
        <SubscribeForm buttonLabel="Subscribe Free, Twice Weekly" formId="footer-subscribe" />
      </Section>

      {/* FOOTER */}
      <footer className="bg-black px-5 py-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} The Kingdom Edit ·{' '}
            <a
              href="mailto:info@thekingdomedit.com"
              className="hover:text-gray-400 transition-colors"
            >
              info@thekingdomedit.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
