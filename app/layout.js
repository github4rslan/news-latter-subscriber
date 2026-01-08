import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Saudi Business Newsletter - Subscribe Free',
  description: 'Your 7am business briefing on all things Saudi. Daily insights on real estate, business, and market updates.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}