const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || './data/nexveda.db';
const contactEmail = process.env.CONTACT_EMAIL || 'nexvedatechnologies@gmail.com';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Configure SMTP Transporter (for Gmail or custom SMTP)
let smtpTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 'your_gmail_app_password_here') {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }

  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`, (createErr) => {
    if (createErr) {
      console.error('Failed to create table:', createErr.message);
      process.exit(1);
    }
  });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const insertSql = `INSERT INTO submissions (name, email, phone, message) VALUES (?, ?, ?, ?)`;
  db.run(insertSql, [name, email, phone || '', message], async (insertErr) => {
    if (insertErr) {
      console.error('Insert error:', insertErr.message);
      return res.status(500).json({ success: false, message: 'Failed to save your message.' });
    }

    // Email notification sending via SMTP or Resend
    if (smtpTransporter) {
      try {
        await smtpTransporter.sendMail({
          from: `"Nexveda Website" <${process.env.SMTP_USER || contactEmail}>`,
          to: contactEmail,
          replyTo: email,
          subject: `New Website Inquiry from ${name}`,
          html: `
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Message:</strong> ${message}</p>
          `,
        });
        console.log(`Email successfully sent via SMTP to ${contactEmail}`);
      } catch (mailErr) {
        console.error('SMTP email error:', mailErr);
      }
    } else if (resend) {
      try {
        await resend.emails.send({
          from: 'Nexveda Contact <onboarding@resend.dev>',
          to: [contactEmail],
          reply_to: email,
          subject: `New Website Inquiry from ${name}`,
          html: `
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Message:</strong> ${message}</p>
          `,
        });
        console.log(`Email successfully sent via Resend to ${contactEmail}`);
      } catch (mailErr) {
        console.error('Resend email error:', mailErr);
      }
    }

    return res.json({ success: true, message: 'Thanks! Your message has been sent successfully.' });
  });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
