import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate inputs
    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    // Configure transporter
    // NOTE: User needs to provide EMAIL_USER and EMAIL_PASS in .env
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or 'outlook', 'yahoo', etc. or custom host
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      replyTo: email,
      subject: `New Contact Form Submission from ${email}`,
      text: `
        Name: ${name || 'Not provided'}
        Email: ${email}
        Message: 
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
