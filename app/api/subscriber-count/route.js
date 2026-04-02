import { NextResponse } from 'next/server'

const BASE_COUNT = 2847

export async function GET() {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      return NextResponse.json({ count: BASE_COUNT })
    }

    const response = await fetch(`https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}`, {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      next: { revalidate: 300 } // cache for 5 minutes
    })

    if (!response.ok) {
      return NextResponse.json({ count: BASE_COUNT })
    }

    const data = await response.json()
    const realCount = data.totalSubscribers || 0

    return NextResponse.json({ count: BASE_COUNT + realCount })
  } catch {
    return NextResponse.json({ count: BASE_COUNT })
  }
}
