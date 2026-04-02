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

    const BREVO_API_KEY     = process.env.BREVO_API_KEY
    const BREVO_LIST_ID     = Number.parseInt(process.env.BREVO_LIST_ID, 10)
    const BREVO_SENDER_NAME  = process.env.BREVO_SENDER_NAME || 'The Kingdom Brief'
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL
    const BREVO_REPLY_TO    = process.env.BREVO_REPLY_TO || BREVO_SENDER_EMAIL

    if (!BREVO_API_KEY) {
      console.error('Brevo API key not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    if (!Number.isFinite(BREVO_LIST_ID)) {
      console.error('Brevo list ID not configured or invalid')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
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
        attributes: { FIRSTNAME: firstName || '', LASTNAME: lastName || '' },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true
      })
    })

    console.log('Brevo response status:', response.status)
    const responseText = await response.text()
    console.log('Brevo response:', responseText)

    let data = {}
    if (responseText) {
      try { data = JSON.parse(responseText) }
      catch (e) { throw new Error('Invalid response from email service') }
    }

    if (!response.ok) {
      if (response.status === 400 && data.code === 'duplicate_parameter') {
        return NextResponse.json({ error: 'This email is already subscribed' }, { status: 400 })
      }
      if (response.status === 401) {
        return NextResponse.json({ error: 'Server configuration error - Invalid API key' }, { status: 500 })
      }
      throw new Error(data.message || `Brevo API error: ${response.status}`)
    }

    // ── STEP 2: Send welcome email ──────────────────────────────
    const firstNameSafe = (firstName || '').trim()
    const greetingName  = firstNameSafe || 'there'

    const welcomeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Welcome to The Kingdom Brief</title>
  <style>
    @media only screen and (max-width: 640px) {
      .email-container { width: 100% !important; }
      .email-body { padding: 24px 20px !important; }
      .email-header { padding: 28px 20px !important; }
      .logo { font-size: 30px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F5EDD6;font-family:Arial,sans-serif;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F5EDD6;">
  <tr>
    <td align="center" style="padding:30px 10px;">
      <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="600"
             style="background-color:#FFFDF7;border-radius:4px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.12);">

        <!-- HEADER -->
        <tr>
          <td class="email-header" align="center"
              style="background-color:#1A1208;padding:40px 40px 32px 40px;">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center"
                    style="background-color:rgba(201,168,76,0.15);border:1px solid #C9A84C;
                           border-radius:2px;padding:5px 14px;">
                  <span style="font-size:10px;font-weight:bold;color:#E8C97A;
                               letter-spacing:3px;text-transform:uppercase;">✦ YOU'RE IN</span>
                </td>
              </tr>
            </table>
            <br/>
            <div class="logo"
                 style="font-family:Georgia,serif;font-size:42px;font-weight:bold;
                        color:#FFFDF7;line-height:1;letter-spacing:-1px;margin:12px 0 6px 0;">
              The Kingdom <span style="color:#C9A84C;">Brief</span>
            </div>
            <div style="font-size:11px;color:rgba(255,253,247,0.5);letter-spacing:2px;
                        text-transform:uppercase;margin-bottom:24px;">
              Your Twice-Weekly Saudi Arabia Digest
            </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="background-color:rgba(201,168,76,0.12);
                           border:1px solid rgba(201,168,76,0.35);
                           border-radius:3px;padding:16px 22px;">
                  <p style="font-family:Georgia,serif;font-size:16px;font-style:italic;
                            color:#E8C97A;line-height:1.6;margin:0;text-align:center;">
                    "You just made a smart move, ${greetingName}."
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- GREEN WELCOME BAND -->
        <tr>
          <td align="center" style="background-color:#1B4332;padding:28px 40px;">
            <p style="font-family:Georgia,serif;font-size:20px;color:#FFFDF7;
                      margin:0 0 10px 0;text-align:center;">
              Welcome aboard! 👋
            </p>
            <p style="font-size:13px;color:rgba(255,253,247,0.75);line-height:1.75;
                      margin:0;text-align:center;">
              Every Tuesday and Friday at 8am GMT, The Kingdom Brief lands in your inbox.
              5 minutes. Everything that matters in Saudi Arabia. Nothing that doesn't.
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="email-body" style="padding:36px 40px;background-color:#FFFDF7;">

            <p style="font-size:14px;color:#3D3530;line-height:1.8;margin:0 0 16px 0;">
              Real estate. Careers. Business opportunities. Lifestyle. The moves
              investors are making <strong>before everyone else catches on.</strong>
            </p>
            <p style="font-size:14px;color:#3D3530;line-height:1.8;margin:0 0 24px 0;">
              No fluff. No politics. <strong>Just the signal.</strong>
            </p>

            <!-- What's coming timeline -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                   style="margin-bottom:24px;background-color:#1A1208;border-radius:3px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="font-size:10px;font-weight:bold;color:#C9A84C;letter-spacing:2px;
                            text-transform:uppercase;margin:0 0 16px 0;">
                    📬 What's coming your way:
                  </p>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid rgba(255,253,247,0.08);">
                        <span style="font-size:12px;color:#C9A84C;font-weight:bold;">Every Tuesday</span>
                        &nbsp;&nbsp;
                        <span style="font-size:13px;color:rgba(255,253,247,0.8);">
                          The Kingdom Edit in your inbox at 8am GMT
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid rgba(255,253,247,0.08);">
                        <span style="font-size:12px;color:#C9A84C;font-weight:bold;">Every Friday</span>
                        &nbsp;&nbsp;
                        <span style="font-size:13px;color:rgba(255,253,247,0.8);">
                          The Kingdom Edit in your inbox at 8am GMT
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="font-size:12px;color:#C9A84C;font-weight:bold;">Bonus</span>
                        &nbsp;&nbsp;
                        <span style="font-size:13px;color:rgba(255,253,247,0.8);">
                          Your Saudi Opportunity Map delivered on signup 🇸🇦
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- WhatsApp nudge -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                   style="margin-bottom:24px;border:1px solid #E8D9B5;
                          border-left:4px solid #C9A84C;border-radius:3px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="font-size:12px;font-weight:bold;color:#8B6914;
                            margin:0 0 6px 0;letter-spacing:0.5px;">
                    📱 COMING SOON: WHATSAPP ALERTS
                  </p>
                  <p style="font-size:13px;color:#3D3530;line-height:1.7;margin:0;">
                    We're working on breaking Saudi news alerts via WhatsApp. Stay tuned, it's coming soon!
                  </p>
                </td>
              </tr>
            </table>

            <p style="font-size:14px;color:#3D3530;line-height:1.8;margin:0 0 6px 0;">
              Questions? Just reply to this email. I read every one.
            </p>

            <!-- Sign off -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                   style="margin-top:28px;padding-top:20px;
                          border-top:1px solid #E8D9B5;">
              <tr>
                <td>
                  <p style="font-size:14px;color:#3D3530;margin:0 0 4px 0;">
                    Welcome aboard,
                  </p>
                  <p style="font-family:Georgia,serif;font-size:20px;
                            font-weight:bold;color:#1A1208;margin:0;">
                    The Kingdom Brief
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td align="center" style="background-color:#1A1208;padding:20px 40px;">
            <p style="font-size:11px;color:rgba(255,253,247,0.3);
                      line-height:1.8;margin:0;text-align:center;">
              The Kingdom Brief &nbsp;·&nbsp; Twice-Weekly Newsletter<br/>
              You're receiving this because you subscribed to The Kingdom Brief.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`

    const welcomeText = [
      `Welcome to The Kingdom Edit Newsletter!`,
      '',
      'Every Tuesday and Friday at 8am GMT, The Kingdom Edit lands in your inbox.',
      '5 minutes. Everything that matters in Saudi Arabia. Nothing that doesn\'t.',
      '',
      'What\'s coming your way:',
      '- Every Tuesday: The Kingdom Edit at 8am GMT',
      '- Every Friday:  The Kingdom Edit at 8am GMT',
      '- Bonus:         Your Saudi Opportunity Map delivered on signup',
      '',
      'WhatsApp alerts coming soon.',
      '',
      'Questions? Just reply to this email.',
      '',
      'Welcome aboard,',
      'The Kingdom Edit Team'
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
          sender:  { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
          to:      [{ email: email.toLowerCase(), name: firstNameSafe || email }],
          replyTo: { email: BREVO_REPLY_TO, name: BREVO_SENDER_NAME },
          subject: `Welcome to The Kingdom Edit Newsletter 🇸🇦`,
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

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' }, { status: 201 })

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
