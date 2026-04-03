import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'The Kingdom Edit — Saudi Arabia Newsletter',
  description: 'The Kingdom Edit is a twice-weekly newsletter covering Saudi Arabia\'s biggest opportunities — real estate, careers, business, and Vision 2030. Join thousands of professionals, investors and relocators.',
  keywords: 'The Kingdom Edit, Saudi Arabia newsletter, Vision 2030, Saudi opportunities, Kingdom Edit, Saudi Arabia digest, expat Saudi Arabia, invest Saudi Arabia, relocate Saudi Arabia',
  authors: [{ name: 'The Kingdom Edit' }],
  creator: 'The Kingdom Edit',
  publisher: 'The Kingdom Edit',
  metadataBase: new URL('https://thekingdomedit.com'),
  alternates: {
    canonical: 'https://thekingdomedit.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://thekingdomedit.com',
    title: 'The Kingdom Edit — Saudi Arabia Newsletter',
    description: 'Twice-weekly intelligence on Saudi Arabia\'s biggest opportunities. Vision 2030, real estate, careers, business. Distilled to 5 minutes.',
    siteName: 'The Kingdom Edit',
    images: [
      {
        url: '/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'The Kingdom Edit — Saudi Arabia Newsletter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Kingdom Edit — Saudi Arabia Newsletter',
    description: 'Twice-weekly intelligence on Saudi Arabia\'s biggest opportunities. Vision 2030, real estate, careers, business.',
    images: ['/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'The Kingdom Edit',
              url: 'https://thekingdomedit.com',
              description: 'Twice-weekly newsletter covering Saudi Arabia\'s biggest opportunities — Vision 2030, real estate, careers, and business.',
              foundingDate: '2025',
              email: 'info@thekingdomedit.com',
              sameAs: [
                'https://thekingdomedit.com',
              ],
              publishingPrinciples: 'https://thekingdomedit.com',
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
