import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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
    const BREVO_SMTP_HOST = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com'
    const BREVO_SMTP_PORT = Number.parseInt(process.env.BREVO_SMTP_PORT || '587', 10)
    const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER
    const BREVO_SMTP_PASS = process.env.BREVO_SMTP_PASS
    const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL
    const BREVO_REPLY_TO = process.env.BREVO_REPLY_TO

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

    if (
      BREVO_SMTP_USER &&
      BREVO_SMTP_PASS &&
      BREVO_SENDER_NAME &&
      BREVO_SENDER_EMAIL &&
      Number.isFinite(BREVO_SMTP_PORT)
    ) {
      try {
        const transporter = nodemailer.createTransport({
          host: BREVO_SMTP_HOST,
          port: BREVO_SMTP_PORT,
          secure: BREVO_SMTP_PORT === 465,
          auth: {
            user: BREVO_SMTP_USER,
            pass: BREVO_SMTP_PASS
          }
        })

        const firstNameSafe = (firstName || '').trim()
        const greetingName = firstNameSafe || 'there'
        const subject = 'Welcome to The Kingdom Brief — your 5-minute Saudi Arabia briefing'
        const text = [
          `Hi ${greetingName},`,
          '',
          'Thanks for subscribing to The Kingdom Brief. You are in.',
          '',
          'Starting now, you will get a 5-minute daily briefing on Saudi Arabia — property, careers, lifestyle, and the opportunities that actually matter. No fluff, no noise.',
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
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <p>Hi ${greetingName},</p>
            <p>Thanks for subscribing to <strong>The Kingdom Brief</strong>. You are in.</p>
            <p>
              Starting now, you will get a 5-minute daily briefing on Saudi Arabia — property, careers,
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
            <p>Welcome aboard,<br />The Kingdom Brief</p>
          </div>
        `

        await transporter.sendMail({
          from: `"${BREVO_SENDER_NAME}" <${BREVO_SENDER_EMAIL}>`,
          to: email,
          replyTo: BREVO_REPLY_TO || BREVO_SENDER_EMAIL,
          subject,
          text,
          html
        })
      } catch (emailError) {
        console.error('Welcome email error:', emailError)
      }
    } else {
      console.warn('SMTP welcome email skipped due to missing configuration')
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
