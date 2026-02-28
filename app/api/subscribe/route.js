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
    const BREVO_LIST_ID = Number.parseInt(process.env.BREVO_LIST_ID, 10)
    const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'The Kingdom Brief'
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL
    const BREVO_REPLY_TO = process.env.BREVO_REPLY_TO || BREVO_SENDER_EMAIL

    if (!BREVO_API_KEY) {
      console.error('Brevo API key not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (!Number.isFinite(BREVO_LIST_ID)) {
      console.error('Brevo list ID not configured or invalid')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('Attempting to subscribe:', email)
    console.log('Using List ID:', BREVO_LIST_ID)

    // ── STEP 1: Add contact to Brevo list ──────────────────────
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

    console.log('Brevo response status:', response.status)

    const responseText = await response.text()
    console.log('Brevo response:', responseText)

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
      if (response.status === 400 && data.code === 'duplicate_parameter') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        )
      }
      if (response.status === 401) {
        console.error('Invalid Brevo API key')
        return NextResponse.json(
          { error: 'Server configuration error - Invalid API key' },
          { status: 500 }
        )
      }
      throw new Error(data.message || `Brevo API error: ${response.status}`)
    }

    // ── STEP 2: Send welcome email via Brevo API ───────────────
    const firstNameSafe = (firstName || '').trim()
    const greetingName = firstNameSafe || 'there'

    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <p>Hi ${greetingName},</p>
        <p>Thanks for subscribing to <strong>The Kingdom Brief</strong>. You are in.</p>
        <p>
          Starting now, you will get a weekly briefing on Saudi Arabia — property, careers,
          lifestyle, and the opportunities that actually matter. No fluff, no noise.
        </p>
        <p><strong>What to expect:</strong></p>
        <ul>
          <li>The signal, not the hype</li>
          <li>Clear, actionable insights</li>
          <li>Quick reads you can finish in minutes</li>
        </ul>
        <p>As a bonus, you will receive your Personalized Saudi Arabia Opportunity Map shortly.</p>
        <p>If you ever want to share feedback, just reply to this email.</p>
        <p>Welcome aboard,<br /><strong>The Kingdom Brief</strong></p>
      </div>
    `

    const welcomeText = [
      `Hi ${greetingName},`,
      '',
      'Thanks for subscribing to The Kingdom Brief. You are in.',
      '',
      'Starting now, you will get a weekly briefing on Saudi Arabia — property, careers, lifestyle, and the opportunities that actually matter. No fluff, no noise.',
      '',
      'What to expect:',
      '- The signal, not the hype',
      '- Clear, actionable insights',
      '- Quick reads you can finish in minutes',
      '',
      'As a bonus, you will receive your Personalized Saudi Arabia Opportunity Map shortly.',
      '',
      'If you ever want to share feedback, just reply to this email.',
      '',
      'Welcome aboard,',
      'The Kingdom Brief'
    ].join('\n')

    try {
      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL
          },
          to: [
            {
              email: email.toLowerCase(),
              name: firstNameSafe || email
            }
          ],
          replyTo: {
            email: BREVO_REPLY_TO,
            name: BREVO_SENDER_NAME
          },
          subject: 'Welcome to The Kingdom Brief — your weekly Saudi Arabia briefing',
          htmlContent: welcomeHtml,
          textContent: welcomeText
        })
      })

      if (emailResponse.ok) {
        console.log('✅ Welcome email sent via Brevo API')
      } else {
        const errText = await emailResponse.text()
        console.error('Welcome email failed:', errText)
      }
    } catch (emailError) {
      console.error('Welcome email error:', emailError)
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
