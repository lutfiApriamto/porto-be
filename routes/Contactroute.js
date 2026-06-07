import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const getUserEmailTemplate = ({ name, subject, message }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Message Received</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #0a0a0a;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #f0f0f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #111111;
      border: 1px solid #1f1f1f;
      border-radius: 20px;
      overflow: hidden;
    }
    .header {
      padding: 48px 40px 32px;
      border-bottom: 1px solid #1f1f1f;
      position: relative;
    }
    .header-accent {
      width: 40px;
      height: 3px;
      background: #C8FF00;
      border-radius: 2px;
      margin-bottom: 24px;
    }
    .header-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #C8FF00;
      margin-bottom: 12px;
      font-family: 'Courier New', monospace;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.1;
      color: #ffffff;
      text-transform: uppercase;
    }
    .header h1 span {
      -webkit-text-stroke: 1px rgba(255,255,255,0.2);
      color: transparent;
      display: block;
    }
    .body {
      padding: 36px 40px;
    }
    .greeting {
      font-size: 15px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .greeting strong {
      color: #ffffff;
    }
    .message-box {
      background: #0d0d0d;
      border: 1px solid #1f1f1f;
      border-left: 3px solid #C8FF00;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 28px;
    }
    .message-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #C8FF00;
      margin-bottom: 10px;
      font-family: 'Courier New', monospace;
    }
    .message-subject {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .message-text {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.7;
    }
    .divider {
      height: 1px;
      background: #1f1f1f;
      margin: 28px 0;
    }
    .reply-note {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
    }
    .reply-note strong {
      color: #C8FF00;
    }
    .footer {
      padding: 24px 40px;
      border-top: 1px solid #1f1f1f;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-name {
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #ffffff;
    }
    .footer-role {
      font-size: 10px;
      color: #6b7280;
      font-family: 'Courier New', monospace;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }
    .footer-badge {
      background: rgba(200, 255, 0, 0.08);
      border: 1px solid rgba(200, 255, 0, 0.25);
      color: #C8FF00;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 100px;
      font-family: 'Courier New', monospace;
    }
    .bottom-note {
      text-align: center;
      margin-top: 24px;
      font-size: 11px;
      color: #374151;
      font-family: 'Courier New', monospace;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-accent"></div>
        <div class="header-label">Message Confirmed</div>
        <h1>
          Got Your
          <span>Message.</span>
        </h1>
      </div>
      <div class="body">
        <p class="greeting">
          Hey <strong>${name}</strong>, your message has landed safely. I'll review it and get back to you as soon as possible — usually within 1–2 business days.
        </p>
        <div class="message-box">
          <div class="message-label">Your Message</div>
          <div class="message-subject">${subject}</div>
          <div class="message-text">${message}</div>
        </div>
        <div class="divider"></div>
        <p class="reply-note">
          I'll reply directly to this email address. If you don't hear back within 48 hours, feel free to reach out again at <strong>${process.env.EMAIL_USER}</strong>.
        </p>
      </div>
      <div class="footer">
        <div>
          <div class="footer-name">Muhammad Lutfi Apriamto</div>
          <div class="footer-role">Full-Stack Web Developer</div>
        </div>
        <div class="footer-badge">Available for Work</div>
      </div>
    </div>
    <div class="bottom-note">
      © ${new Date().getFullYear()} Lutfi Apriamto — This is an automated confirmation.
    </div>
  </div>
</body>
</html>
`;

const getOwnerEmailTemplate = ({ name, email, subject, message }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Message</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #0a0a0a;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #f0f0f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #111111;
      border: 1px solid #1f1f1f;
      border-radius: 20px;
      overflow: hidden;
    }
    .header {
      padding: 48px 40px 32px;
      border-bottom: 1px solid #1f1f1f;
    }
    .ping-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .ping-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
    }
    .ping-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #22c55e;
      font-family: 'Courier New', monospace;
    }
    .header h1 {
      font-size: 30px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      color: #ffffff;
      line-height: 1.1;
    }
    .header h1 span {
      color: #C8FF00;
    }
    .body {
      padding: 36px 40px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .meta-item {
      background: #0d0d0d;
      border: 1px solid #1f1f1f;
      border-radius: 10px;
      padding: 14px 16px;
    }
    .meta-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 6px;
      font-family: 'Courier New', monospace;
    }
    .meta-value {
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      word-break: break-all;
    }
    .meta-email {
      grid-column: span 2;
    }
    .message-box {
      background: #0d0d0d;
      border: 1px solid #1f1f1f;
      border-left: 3px solid #22c55e;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
    }
    .message-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #22c55e;
      margin-bottom: 10px;
      font-family: 'Courier New', monospace;
    }
    .message-subject {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .message-text {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    .reply-btn {
      display: inline-block;
      background: #C8FF00;
      color: #050505;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-family: 'Courier New', monospace;
    }
    .timestamp {
      font-size: 11px;
      color: #374151;
      font-family: 'Courier New', monospace;
      margin-top: 16px;
    }
    .footer {
      padding: 20px 40px;
      border-top: 1px solid #1f1f1f;
      font-size: 10px;
      color: #374151;
      font-family: 'Courier New', monospace;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="ping-row">
          <div class="ping-dot"></div>
          <div class="ping-label">New Incoming Message</div>
        </div>
        <h1>Someone Just <span>Reached Out.</span></h1>
      </div>
      <div class="body">
        <div class="meta-grid">
          <div class="meta-item">
            <div class="meta-label">From</div>
            <div class="meta-value">${name}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Subject</div>
            <div class="meta-value">${subject}</div>
          </div>
          <div class="meta-item meta-email">
            <div class="meta-label">Reply To</div>
            <div class="meta-value">${email}</div>
          </div>
        </div>
        <div class="message-box">
          <div class="message-label">Full Message</div>
          <div class="message-subject">${subject}</div>
          <div class="message-text">${message}</div>
        </div>
        <a href="mailto:${email}?subject=Re: ${subject}" class="reply-btn">
          Reply to ${name} ↗
        </a>
        <div class="timestamp">
          Received: ${new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })} WIB
        </div>
      </div>
      <div class="footer">
        Portfolio Contact Form — lutfiapriamto.dev
      </div>
    </div>
  </div>
</body>
</html>
`;

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: name, email, subject, message.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address format.',
    });
  }

  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: `"Lutfi Apriamto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Got your message — ${subject}`,
      html: getUserEmailTemplate({ name, subject, message }),
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name} — ${subject}`,
      html: getOwnerEmailTemplate({ name, email, subject, message }),
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully. Check your email for confirmation.',
    });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;