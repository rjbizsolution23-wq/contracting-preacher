import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // SendGrid Marketing Contacts integration
    if (process.env.SENDGRID_API_KEY) {
      try {
        const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          },
          body: JSON.stringify({
            contacts: [
              {
                email,
                ...(firstName && { first_name: firstName }),
                custom_fields: {
                  source: 'newsletter_signup',
                  signup_date: new Date().toISOString(),
                },
              },
            ],
          }),
        })

        if (!response.ok) {
          console.error('SendGrid newsletter error:', await response.text())
          // Don't fail the user — log and continue
        }

        // Send welcome email
        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email, ...(firstName && { name: firstName }) }],
                subject: 'Welcome to The Contracting Preacher Newsletter!',
              },
            ],
            from: {
              email: process.env.SENDGRID_FROM_EMAIL || 'pastor@thecontractingpreacher.com',
              name: 'Pastor McKnight — The Contracting Preacher',
            },
            content: [
              {
                type: 'text/html',
                value: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="font-family: Georgia, serif; background:#f5f3ef; margin:0; padding:0;">
                    <div style="max-width:600px; margin:0 auto; background:#fff;">
                      <!-- Header -->
                      <div style="background:#0A1628; padding:40px 40px 30px;">
                        <div style="color:#C9A84C; font-family: Montserrat, sans-serif; font-weight:700; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin-bottom:8px;">The Contracting</div>
                        <div style="color:#C9A84C; font-family: Montserrat, sans-serif; font-weight:900; font-size:24px; letter-spacing:2px; text-transform:uppercase;">Preacher</div>
                      </div>
                      
                      <!-- Content -->
                      <div style="padding:40px;">
                        <h1 style="color:#0A1628; font-size:28px; margin-bottom:16px; line-height:1.3;">
                          Welcome${firstName ? `, ${firstName}` : ''}! 🙏
                        </h1>
                        <p style="color:#4B5563; font-size:16px; line-height:1.7; margin-bottom:20px;">
                          Thank you for joining The Contracting Preacher newsletter. You've just taken an important step toward understanding how to win federal government contracts for your business.
                        </p>
                        <p style="color:#4B5563; font-size:16px; line-height:1.7; margin-bottom:20px;">
                          As a subscriber, you'll receive:
                        </p>
                        <ul style="color:#4B5563; font-size:16px; line-height:1.8; margin-bottom:24px; padding-left:24px;">
                          <li>Expert tips on SAM.gov registration and renewals</li>
                          <li>Guides to SBA certifications (8(a), HUBZone, WOSB, SDVOSB)</li>
                          <li>Proposal writing strategies that win</li>
                          <li>Federal contracting news and updates</li>
                          <li>Exclusive resources and tools</li>
                        </ul>
                        
                        <div style="background:#F5F3EF; border-left:4px solid #C9A84C; padding:20px 24px; margin:28px 0; border-radius:0 8px 8px 0;">
                          <p style="color:#0A1628; font-style:italic; font-size:17px; margin:0; line-height:1.6;">
                            "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."
                          </p>
                          <p style="color:#C9A84C; font-size:14px; font-weight:600; margin:8px 0 0;">— Jeremiah 29:11</p>
                        </div>
                        
                        <p style="color:#4B5563; font-size:16px; line-height:1.7; margin-bottom:28px;">
                          Ready to take the next step? Schedule a free 30-minute consultation and let's map out your path to winning government contracts.
                        </p>
                        
                        <a href="https://thecontractingpreacher.com/free-consultation" 
                           style="display:inline-block; background:#C9A84C; color:#0A1628; font-family:Montserrat,sans-serif; font-weight:700; font-size:14px; padding:14px 28px; border-radius:8px; text-decoration:none; letter-spacing:0.5px;">
                          Schedule Free Consultation →
                        </a>
                      </div>
                      
                      <!-- Footer -->
                      <div style="background:#060E1A; padding:24px 40px; text-align:center;">
                        <p style="color:#6B7280; font-size:12px; margin:0 0 8px;">
                          © ${new Date().getFullYear()} The Contracting Preacher | South Carolina, United States
                        </p>
                        <p style="color:#6B7280; font-size:11px; margin:0;">
                          You received this because you subscribed at thecontractingpreacher.com
                        </p>
                      </div>
                    </div>
                  </body>
                  </html>
                `,
              },
            ],
          }),
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    } else {
      // Development mode - log subscription
      console.log('Newsletter subscription (dev mode):', {
        email,
        firstName,
        subscribedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to the newsletter' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
