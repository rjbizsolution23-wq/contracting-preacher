import { pushToGhl, createGhlAppointment } from '../_shared/ghl'

interface Env {
  SENDGRID_API_KEY?: string
  SENDGRID_FROM_EMAIL?: string
  DB?: D1Database
  GHL_PIT?: string
  GHL_LOCATION_ID?: string
  GHL_CALENDAR_ID?: string
}

/**
 * Converts the booking form's "2026-09-05" + "10:00 AM" (always interpreted
 * as the site's published EST hours -- see BookingCalendar.tsx / the
 * confirmation emails below, both of which say "EST") into an ISO-8601
 * date-time WITH an explicit -05:00 offset, e.g. "2026-09-05T10:00:00-05:00".
 * GHL's calendar/appointments API requires an explicit offset -- a bare or
 * UTC timestamp gets checked against the wrong wall-clock hour and either
 * 400s with "slot no longer available" or books the wrong hour silently.
 * Returns null if date/time can't be parsed.
 */
function toEstIso(date: string, time: string): string | null {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim())
  if (!m || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  let hour = parseInt(m[1], 10) % 12
  if (/pm/i.test(m[3])) hour += 12
  const minute = m[2]
  const hh = String(hour).padStart(2, '0')
  return `${date}T${hh}:${minute}:00-05:00`
}

interface BookingBody {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  service?: string
  notes?: string
  date?: string
  time?: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  try {
    const body: BookingBody = await context.request.json()
    const { firstName, lastName, email, phone, company, service, notes, date, time } = body

    if (!firstName || !lastName || !email || !phone || !company || !service || !date || !time) {
      return new Response(JSON.stringify({ error: 'All required fields must be filled' }), {
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
      // Send notification to Dr. McKnight
      const notificationResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: env.SENDGRID_FROM_EMAIL || 'info@thecontractingpreacher.com' }],
              subject: `📅 New Consultation Booking: ${firstName} ${lastName} — ${date} at ${time}`,
            },
          ],
          from: {
            email: env.SENDGRID_FROM_EMAIL || 'info@thecontractingpreacher.com',
            name: 'The Contracting Preacher Bookings',
          },
          reply_to: { email, name: `${firstName} ${lastName}` },
          content: [
            {
              type: 'text/html',
              value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                  <h2 style="color: #1a365d;">New Consultation Booking</h2>
                  <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${date}</p>
                    <p style="margin: 8px 0;"><strong>🕐 Time:</strong> ${time} EST</p>
                    <p style="margin: 8px 0;"><strong>⏱ Duration:</strong> 30 minutes</p>
                  </div>
                  <h3 style="color: #1a365d;">Client Details</h3>
                  <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Company:</strong> ${company}</p>
                  <p><strong>Service:</strong> ${service}</p>
                  ${notes ? `<p><strong>Notes:</strong> ${notes.replace(/\n/g, '<br>')}</p>` : ''}
                  <hr style="margin: 20px 0;">
                  <p style="color: #999; font-size: 12px;">Booked via The Contracting Preacher website.</p>
                </div>
              `,
            },
          ],
        }),
      })

      if (!notificationResponse.ok) {
        console.error('SendGrid notification error:', await notificationResponse.text())
        emailDelivery = 'failed'
      } else {
        emailDelivery = 'sent'
      }

      // Send confirmation to client
      const confirmationResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email, name: `${firstName} ${lastName}` }],
              subject: `Your Free Consultation is Confirmed — ${date} at ${time} EST`,
            },
          ],
          from: {
            email: env.SENDGRID_FROM_EMAIL || 'info@thecontractingpreacher.com',
            name: 'Dr. McKnight — The Contracting Preacher',
          },
          content: [
            {
              type: 'text/html',
              value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                  <h2 style="color: #1a365d;">Your Consultation is Confirmed!</h2>
                  <p>Hi ${firstName},</p>
                  <p>Thank you for booking a free consultation with The Contracting Preacher. Here are your details:</p>
                  <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #c5a04e;">
                    <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${date}</p>
                    <p style="margin: 8px 0;"><strong>🕐 Time:</strong> ${time} EST</p>
                    <p style="margin: 8px 0;"><strong>⏱ Duration:</strong> 30 minutes</p>
                    <p style="margin: 8px 0;"><strong>📋 Service:</strong> ${service}</p>
                  </div>
                  <p>Dr. McKnight will call you at <strong>${phone}</strong> at the scheduled time.</p>
                  <h3 style="color: #1a365d;">What to Prepare</h3>
                  <ul>
                    <li>Your business details (name, structure, NAICS codes if known)</li>
                    <li>Any current SAM.gov registration or certifications</li>
                    <li>Questions about federal contracting you'd like answered</li>
                  </ul>
                  <p>If you need to reschedule, simply reply to this email or call (202) 276-2913.</p>
                  <p>Looking forward to helping you win federal contracts!</p>
                  <p><strong>Dr. McKnight</strong><br>The Contracting Preacher<br>thecontractingpreacher.com</p>
                </div>
              `,
            },
          ],
        }),
      })

      if (!confirmationResponse.ok) {
        console.error('SendGrid confirmation error:', await confirmationResponse.text())
      }
    } else {
      console.log('Booking submission (no SendGrid key):', {
        firstName, lastName, email, phone, company, service, notes, date, time,
        submittedAt: new Date().toISOString(),
      })
    }

    // Persist to the CRM. Previously this endpoint only sent email and the
    // booking request was otherwise invisible to the admin CRM dashboard.
    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO booking_requests (
            id, first_name, last_name, email, phone, company, service, notes,
            requested_date, requested_time, status, email_delivery, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            firstName,
            lastName,
            email.trim().toLowerCase(),
            phone,
            company,
            service,
            notes || '',
            date,
            time,
            'requested',
            emailDelivery,
            new Date().toISOString()
          )
          .run()
      } catch (dbError) {
        console.error('Booking CRM persistence error:', dbError)
      }
    }

    // Push to GoHighLevel CRM (best-effort; never blocks the response), then
    // -- using the contact id it returns -- book a real appointment on the
    // GHL Calendar so the slot actually appears on Dr. McKnight's calendar
    // (and any connected Google Calendar), not just as a tagged contact.
    const ghlPush = await pushToGhl(env, {
      firstName,
      lastName,
      email,
      phone,
      companyName: company,
      tags: ['booking-request'],
      customFields: {
        company,
        service_interested_in: service,
        booking_requested_date: date,
        booking_requested_time: time,
        booking_notes: notes || '',
        booking_status: 'pending',
      },
    })

    if (ghlPush.ok && ghlPush.contactId) {
      const startTime = toEstIso(date, time)
      if (startTime) {
        const apptResult = await createGhlAppointment(env, {
          contactId: ghlPush.contactId,
          startTime,
          title: `Free Consultation — ${firstName} ${lastName} (${company})`,
        })
        if (!apptResult.ok && !apptResult.skipped) {
          console.error('GHL appointment booking failed:', apptResult.status, apptResult.error)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Consultation booked successfully' }),
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Booking error:', error)
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
