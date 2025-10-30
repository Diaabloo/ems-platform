import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { findUserByEmail, verifyPassword, createUser, findAdmins, updateUser, deleteUser } from '../models/userModel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { setOTP, verifyOTP } from '../models/verificationCode.js';
import logger from '../utils/logger.js';

const OTP_EXPIRATION = 5 * 60 * 1000; // 5 min

// --- CRUD ---
export async function createAdmin(email, password) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('Email already used');

  return createUser(email, password, 'admin');
}

export async function getAdmins() {
  return findAdmins();
}

export async function updateAdmin(id, email, password) {
  const data = {};
  if (email) {
    const existing = await findUserByEmail(email);
    if (existing && existing.id !== id) throw new Error('Email already used by another user');
    data.email = email;
  }
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  if (Object.keys(data).length === 0) throw new Error('No data to update');
  return updateUser(id, data);
}

export async function deleteAdmin(id) {
  return deleteUser(id);
}

// --- Login + OTP ---
export async function loginAdmin(email, password) {
  const admin = await findUserByEmail(email);
  if (!admin || admin.role !== 'admin') {
    logger.error(`Login attempt failed for ${email}`);
    return null;
  }

  const valid = await verifyPassword(admin, password);
  if (!valid) {
    logger.error(`Invalid password for ${email}`);
    return null;
  }

  const code = crypto.randomInt(100000, 999999).toString();
  setOTP(admin.id, code, OTP_EXPIRATION);

  // Send code in email
  await sendOTPEmail(admin.email, code);

  logger.info(`OTP generated for userId: ${admin.id}`);

  return { userId: admin.id }; // Do not return the code to production; for testing, log it
}

// Verify OTP et generate JWT
export async function verifyAdminCode(userId, code) {
  const valid = verifyOTP(userId, code);
  if (!valid) {
    logger.error(`OTP invalid for userId: ${userId}`);
    return null;
  }

  const admin = await prisma.user.findUnique({ where: { id: userId } });
  if (!admin) return null;

  // Generate JWT with email for middleware checks
  const token = jwt.sign({ userId, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  logger.info(`JWT généré pour userId: ${userId}`);
  return token;
}

// --- Send OTP code in email ---
async function sendOTPEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
  <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vérification de votre compte</title>
      <style>
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          background-color: rgb(255, 255, 255);
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          border: 1px solid rgb(230, 230, 230);
        }
        .header {
          text-align: center;
          padding: 20px;
          background-color: #009768;
          color: #FFFFFF;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .logo {
          margin-bottom: 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #FFFFFF;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #009768;
          letter-spacing: 5px;
          margin: 20px 0;
        }
        .content p {
          color: #121212;
          font-size: 16px;
          line-height: 1.5;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: rgb(140, 140, 140);
        }
        .footer a {
          color: #009768;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            margin: 10px;
            padding: 10px;
          }
          .otp-code {
            font-size: 28px;
            letter-spacing: 3px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verifying your account</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Use the code below to verify your identity:</p>
          <div class="otp-code">${code}</div>
          <p>This code is valid for 5 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Employee Management. All rights reserved.</p>
          <p><a href="mailto:support@yourcompany.com">Contact us</a></p>
        </div>
      </div>
    </body>
    </html>
  `;



  try {
    await transporter.sendMail({
      from: `"super admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your verification code',
      html: htmlTemplate,
    });
    logger.info(`Email OTP send for ${email}`);
  } catch (err) {
    logger.error(`Error send email for ${email}: ${err.message}`);
    throw err;
  }
}