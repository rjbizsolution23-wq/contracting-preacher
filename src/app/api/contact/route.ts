import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, service, message } = body

    if (!firstName || !lastName || !email || !phone || !company || !service || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (process.env.SENDGRID_API_KEY) {
      const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: process.env.SENDGRID_FROM_EMAIL || 'pastor@thecontractingpreacher.com' }],
              subject: `New Contact: ${firstName} ${lastName} — ${company}`,
            },
          ],
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'pastor@thecontractingpreacher.com',
            name: 'The Contracting Preacher Website',
          },
          reply_to: { email, name: `${firstName} ${lastName}` },
          content: [
            {
              type: 'text/html',
              value: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p><em>Submitted from The Contracting Preacher website.</em></p>
              `,
            },
          ],
        }),
      })

      if (!sgResponse.ok) {
        console.error('SendGrid error:', await sgResponse.text())
      }
    } else {
      console.log('Contact form submission (dev mode):', {
        firstName, lastName, email, phone, company, service, message,
        submittedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true, message: 'Contact form submitted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
