import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'The Saudi Entry Strategy — Twice-Weekly Briefing',
  description: 'Vision 2030 is rewriting the rules. Every Tuesday and Friday, get the opportunities worth acting on — distilled to 5 minutes, zero noise.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}