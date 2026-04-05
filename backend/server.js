// ─── Portfolio Contact Form - Email Server ────────────────────────────────────
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: true }));
app.use(express.json());

// ─── Email transporter ────────────────────────────────────────────────────────
// Strip spaces from App Password (copy-paste from Gmail often includes spaces)
const gmailUser = (process.env.GMAIL_USER || '').trim();
const gmailPass = (process.env.GMAIL_APP_PASS || '').replace(/\s/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: gmailUser, pass: gmailPass },
});

// ─── Verify transporter on startup ───────────────────────────────────────────
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
    console.error('   → Check GMAIL_USER and GMAIL_APP_PASS in backend/.env');
  } else {
    console.log('✅ Email transporter is ready — Gmail SMTP connected');
  }
});

// ─── Root route — friendly status page ───────────────────────────────────────
app.get('/', (_, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif;text-align:center;padding:60px;color:#333;">
        <h1>🚀 Portfolio Contact API</h1>
        <p>Server is running on port <strong>${PORT}</strong></p>
        <p>POST to <code>/api/contact</code> to send an email.</p>
        <p><a href="/health">Health check →</a></p>
      </body>
    </html>
  `);
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    gmail: gmailUser,
    passLength: gmailPass.length,
    passOk: gmailPass.length === 16,
  });
});

// ─── POST /api/contact ────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  try {
    // 1. Notification email → you
    await transporter.sendMail({
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
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
            <p style="margin:0;color:#9ca3af;font-size:0.8rem;">Sent from your Portfolio Contact Form</p>
          </div>
        </div>
      `,
    });

    // 2. Confirmation email → visitor
    await transporter.sendMail({
      from: `"Subhodeep Mondal" <${gmailUser}>`,
      to: email,
      subject: `Thank you for reaching out, ${name}! 🌸`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="background:#1e1e2e;padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:1.6rem;">Message Received! 🌸</h1>
          </div>
          <div style="padding:30px;background:#fff;">
            <p style="color:#374151;font-size:1rem;line-height:1.7;">Hi <strong>${name}</strong>,</p>
            <p style="color:#374151;font-size:1rem;line-height:1.7;">Thank you so much for reaching out! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
            <div style="background:#f9fafb;border-left:4px solid #3b5bdb;padding:15px 20px;margin:20px 0;border-radius:0 6px 6px 0;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:0.85rem;font-weight:600;text-transform:uppercase;">Your message</p>
              <p style="margin:0;color:#374151;white-space:pre-wrap;font-size:0.95rem;">${message}</p>
            </div>
            <p style="color:#374151;font-size:1rem;line-height:1.7;">
              Connect with me on <a href="https://www.linkedin.com/in/subhodeep-mondal-a3a2762b5" style="color:#3b5bdb;text-decoration:none;">LinkedIn</a> or check out my work on <a href="https://github.com/ShadowLegend007" style="color:#3b5bdb;text-decoration:none;">GitHub</a>.
            </p>
            <p style="color:#374151;font-size:1rem;line-height:1.7;margin-top:20px;">Warm regards,<br/><strong>Subhodeep Mondal</strong></p>
          </div>
          <div style="background:#f9fafb;padding:15px 30px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:0.8rem;">Kolkata, West Bengal, India</p>
          </div>
        </div>
      `,
    });

    console.log(`📨 Contact form submitted by ${name} <${email}>`);
    res.status(200).json({ message: 'Emails sent successfully!' });

  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Contact server running at http://localhost:${PORT}`);
  console.log(`   Gmail: ${gmailUser}`);
  console.log(`   Pass length: ${gmailPass.length} chars (should be 16)`);
});
