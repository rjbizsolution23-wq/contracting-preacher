interface Env {
  SENDGRID_API_KEY?: string
  SENDGRID_FROM_EMAIL?: string
  DB?: D1Database
}

interface ContactBody {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  service?: string
  message?: string
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  try {
    const body: ContactBody = await context.request.json()
    const { firstName, lastName, email, phone, company, service, message, source, utmSource, utmMedium, utmCampaign, referrer } = body

    if (!firstName || !lastName || !email || !phone || !company || !service || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const { env } = context
    let emailDelivery = 'not-configured'

    if (env.SENDGRID_API_KEY) {
      const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: env.SENDGRID_FROM_EMAIL || 'info@thecontractingpreacher.com' }],
              subject: `New Contact: ${firstName} ${lastName} — ${company}`,
            },
          ],
          from: {
            email: env.SENDGRID_FROM_EMAIL || 'info@thecontractingpreacher.com',
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
                <p><strong>Service Interested In:</strong> ${service}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p style="color:#999;font-size:12px;">Submitted via The Contracting Preacher website contact form.</p>
              `,
            },
          ],
        }),
      })

      if (sgResponse.ok) {
        emailDelivery = 'sent'
      } else {
        emailDelivery = 'failed'
        console.error('SendGrid error:', await sgResponse.text())
      }
    } else {
      console.log('Contact form submission (no SendGrid key):', {
        firstName, lastName, email, phone, company, service, message,
        submittedAt: new Date().toISOString(),
      })
    }

    // Persist to the CRM. Previously this endpoint only sent an email and
    // the submission was otherwise invisible to the admin CRM dashboard.
    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO contact_submissions (
            id, first_name, last_name, email, phone, company, service, message,
            source, utm_source, utm_medium, utm_campaign, referrer, status, email_delivery, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            firstName,
            lastName,
            email.trim().toLowerCase(),
            phone,
            company,
            service,
            message,
            source || 'contact-form',
            utmSource || '',
            utmMedium || '',
            utmCampaign || '',
            referrer || '',
            'new',
            emailDelivery,
            new Date().toISOString()
          )
          .run()
      } catch (dbError) {
        // Do not fail the user-facing request if the CRM write fails
        // (e.g. migration 0003 not yet applied) -- the email path already
        // succeeded or was attempted above.
        console.error('Contact CRM persistence error:', dbError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Contact form submitted successfully' }),
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
