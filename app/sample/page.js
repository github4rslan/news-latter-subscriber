import Link from 'next/link'

export const metadata = {
  title: 'Issue #87 — The Kingdom Edit',
  description: 'Sample issue of The Kingdom Edit — June 2026. Al Alyaa District, SDAIA Hexagon Data Centre, and Wafi registration deadline.',
  robots: { index: true, follow: true },
}

export default function SampleIssuePage() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A1208]">
      <header className="border-b border-[#E8D9B5] px-5 py-6 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="text-sm text-[#8B6914] hover:text-[#1A1208] transition-colors"
          >
            ← Back to The Kingdom Edit
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B6914] mt-4 mb-2">
            Sample Issue
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Issue #87 — June 2026
          </h1>
        </div>
      </header>

      <main className="px-5 py-10 sm:px-8">
        <article className="max-w-2xl mx-auto space-y-10">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8B6914] mb-3">
              Lead Story
            </h2>
            <h3 className="font-serif text-xl font-bold mb-3">
              Al Alyaa District, Knowledge Economic City
            </h3>
            <p className="text-[#3D3530] text-sm sm:text-base leading-relaxed">
              Construction at 70%, handover Q1 2027. Updated payment structure for non-Saudi buyers.
              What changed, and what to confirm before signing.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8B6914] mb-3">
              Supporting Signal
            </h2>
            <h3 className="font-serif text-xl font-bold mb-3">
              SDAIA Hexagon Data Centre
            </h3>
            <p className="text-[#3D3530] text-sm sm:text-base leading-relaxed">
              480MW capacity, EPC contract awarded. Implications for AI infrastructure entrants.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8B6914] mb-3">
              Practical Note
            </h2>
            <p className="text-[#3D3530] text-sm sm:text-base leading-relaxed">
              Wafi registration deadline this month. Direct link and required documentation included
              in the full subscriber edition.
            </p>
          </section>

          <div className="border-t border-[#E8D9B5] pt-8">
            <p className="text-sm text-[#3D3530] mb-4">
              This is a representative sample. Subscribers receive issues like this every Tuesday and
              Friday at 8am GMT.
            </p>
            <Link
              href="/#subscribe"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-[#1A1208] text-[#FFFDF7] font-semibold rounded-lg hover:bg-[#2a2010] transition-colors"
            >
              Subscribe — Free
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}
