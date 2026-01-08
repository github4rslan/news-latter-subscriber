import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, firstName, lastName } = await request.json()
    
    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Get Brevo credentials from environment variables
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID)

    if (!BREVO_API_KEY) {
      console.error('Brevo API key not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('Attempting to subscribe:', email)
    console.log('Using List ID:', BREVO_LIST_ID)

    // Call Brevo API
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        attributes: {
          FIRSTNAME: firstName || '',
          LASTNAME: lastName || ''
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true
      })
    })

    // Log response status
    console.log('Brevo response status:', response.status)

    // Try to get response text first
    const responseText = await response.text()
    console.log('Brevo response:', responseText)

    // Parse JSON only if there's content
    let data = {}
    if (responseText) {
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse response:', responseText)
        throw new Error('Invalid response from email service')
      }
    }

    if (!response.ok) {
      // Handle duplicate email
      if (response.status === 400 && data.code === 'duplicate_parameter') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        )
      }
      
      // Handle unauthorized
      if (response.status === 401) {
        console.error('Invalid Brevo API key')
        return NextResponse.json(
          { error: 'Server configuration error - Invalid API key' },
          { status: 500 }
        )
      }
      
      throw new Error(data.message || `Brevo API error: ${response.status}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    }, { status: 201 })

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}