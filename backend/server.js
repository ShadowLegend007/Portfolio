// ─── Portfolio Contact Form - HTTP Email Server ────────────────────────────────────
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: true }));
app.use(express.json());

// ─── Configuration ────────────────────────────────────────────────────────────
// Use RESEND_API_KEY if available in .env
const resendApiKey = process.env.RESEND_API_KEY;
// We'll reuse GMAIL_USER as the destination email address since you already have it set!
const myEmail = process.env.GMAIL_USER; 

// ─── Root route — friendly status page ───────────────────────────────────────
app.get('/', (_, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif;text-align:center;padding:60px;color:#333;">
        <h1>🚀 Portfolio HTTP Contact API</h1>
        <p>Server is running on port <strong>${PORT}</strong></p>
        <p>POST to <code>/api/contact</code> to send an email via Resend.</p>
        <p><a href="/health">Health check →</a></p>
      </body>
    </html>
  `);
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    emailDestination: myEmail,
    resendKeyConfigured: !!resendApiKey,
  });
});

// ─── POST /api/contact ────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  if (!resendApiKey) {
    console.error('❌ Missing RESEND_API_KEY in .env settings!');
    return res.status(500).json({ error: 'Server misconfiguration: Email provider API key missing.' });
  }

  try {
    // 1. Send Notification Email to You via Resend
    const resendPayload = {
      // Free tier on Resend requires you to use their testing address to send emails outward.
      from: 'Portfolio Contact <onboarding@resend.dev>',
      // The destination email must match the account you verified on Resend!
      to: [myEmail],
      reply_to: email, // If you hit "Reply" in your email client, it goes to the visitor automatically!
      subject: `📬 New Message from ${name} — Portfolio`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="background:#1e1e2e;padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:1.6rem;">New Contact Form Submission</h1>
          </div>
          <div style="padding:30px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#6b7280;font-size:0.85rem;font-weight:600;text-transform:uppercase;width:100px;">Name</td><td style="padding:10px 0;color:#111827;">${name}</td></tr>
              <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:0.85rem;font-weight:600;text-transform:uppercase;">Email</td><td style="padding:10px 0;"><a href="mailto:${email}" style="color:#3b5bdb;">${email}</a></td></tr>
              <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:0.85rem;font-weight:600;text-transform:uppercase;">Phone</td><td style="padding:10px 0;color:#111827;">${phone || 'Not provided'}</td></tr>
              <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:0.85rem;font-weight:600;text-transform:uppercase;vertical-align:top;">Message</td><td style="padding:10px 0;color:#111827;white-space:pre-wrap;">${message}</td></tr>
            </table>
          </div>
          <div style="background:#f9fafb;padding:15px 30px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:0.8rem;">Sent via Resend HTTP API</p>
          </div>
        </div>
      `,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resendPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Resend framework failed to accept payload');
    }

    console.log(`📨 Contact form successfully relayed via Resend API! ID: ${data.id}`);

    // NOTE: Sending an auto-confirmation back to the visitor requires verifying a custom domain on Resend.
    // Free testing tiers only allow sending TO yourself. So we only send the notification to you for now!
    res.status(200).json({ message: 'Emails sent successfully!' });

  } catch (err) {
    console.error('❌ API Request to Email provider failed:', err.message);
    res.status(500).json({ error: 'Failed to trigger email system via HTTP.' });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 HTTP Contact API running at http://localhost:${PORT}`);
  console.log(`   Destination Email: ${myEmail}`);
  console.log(`   Resend API Key Valid: ${!!resendApiKey}`);
});
