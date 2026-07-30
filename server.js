const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || './data/nexveda.db';
const contactEmail = process.env.CONTACT_EMAIL || 'nexvedatechnologies@gmail.com';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    if (resend) {
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
