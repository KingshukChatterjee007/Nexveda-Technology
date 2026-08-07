const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
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
  console.log(`✉️ Email Service: Configured via SMTP (${process.env.SMTP_USER})`);
} else if (resend) {
  console.log(`✉️ Email Service: Configured via Resend API`);
} else {
  console.warn(`⚠️ Email Service: Disabled (SMTP_PASS is set to placeholder or missing in .env)`);
}

// Database Setup (Supports PostgreSQL & SQLite)
let dbType = 'sqlite';
let pgPool = null;
let sqliteDb = null;

const pgHost = process.env.DB_HOST || process.env.PG_HOST;
const pgUser = process.env.DB_USER || process.env.PG_USER;
const pgPass = process.env.DB_PASSWORD || process.env.PG_PASSWORD;
const pgDbName = process.env.DB_NAME || process.env.PG_DATABASE || 'nexveda';
const pgPort = parseInt(process.env.DB_PORT || process.env.PG_PORT || '5432', 10);
const connectionString = process.env.DATABASE_URL;

if (connectionString || pgHost) {
  dbType = 'postgres';

  async function initPostgres() {
    try {
      if (!connectionString && pgHost) {
        // Step 1: Ensure target database exists by connecting to 'postgres' default database
        const adminPool = new Pool({
          host: pgHost,
          port: pgPort,
          user: pgUser,
          password: pgPass,
          database: 'postgres',
          ssl: false
        });

        try {
          const res = await adminPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [pgDbName]);
          if (res.rowCount === 0) {
            await adminPool.query(`CREATE DATABASE "${pgDbName}"`);
            console.log(`PostgreSQL database "${pgDbName}" created successfully.`);
          }
        } catch (dbCreateErr) {
          console.warn('Database auto-creation note:', dbCreateErr.message);
        } finally {
          await adminPool.end().catch(() => {});
        }
      }

      // Step 2: Connect to target database
      pgPool = new Pool(connectionString ? {
        connectionString,
        ssl: process.env.PG_SSL === 'false' ? false : { rejectUnauthorized: false }
      } : {
        host: pgHost,
        port: pgPort,
        user: pgUser,
        password: pgPass,
        database: pgDbName,
        ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
      });

      await pgPool.query(`CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      console.log(`Connected to PostgreSQL Database "${pgDbName}" (Table: submissions ready)`);
    } catch (err) {
      console.error('PostgreSQL setup/connection error:', err.message);
    }
  }

  initPostgres();
} else {
  const dbPath = process.env.DB_PATH || './data/nexveda.db';
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('SQLite connection error:', err.message);
      process.exit(1);
    }

    sqliteDb.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`, (createErr) => {
      if (createErr) {
        console.error('Failed to create SQLite table:', createErr.message);
        process.exit(1);
      } else {
        console.log(`Connected to SQLite Database at ${dbPath}`);
      }
    });
  });
}

// Helper function to save submission
async function saveSubmission(name, email, phone, message) {
  if (dbType === 'postgres') {
    const query = `INSERT INTO submissions (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id`;
    await pgPool.query(query, [name, email, phone || '', message]);
  } else {
    return new Promise((resolve, reject) => {
      const insertSql = `INSERT INTO submissions (name, email, phone, message) VALUES (?, ?, ?, ?)`;
      sqliteDb.run(insertSql, [name, email, phone || '', message], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    await saveSubmission(name, email, phone, message);
  } catch (dbErr) {
    console.error('Database Insert Error:', dbErr.message);
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

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
