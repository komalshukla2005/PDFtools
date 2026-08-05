import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    // Save to database
    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `PDFForge Contact <${process.env.EMAIL_USER}>`,
        to: 'komalshukla23@navgurukul.org',
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        html: `
          <h2>New Contact Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="padding: 12px; border-left: 4px solid #e11d48; background-color: #f3f4f6; color: #1f2937;">
            ${message}
          </p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // We don't return an error response here because the message was successfully saved to the DB
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, message: 'Failed to submit message, please try again later' });
  }
};
