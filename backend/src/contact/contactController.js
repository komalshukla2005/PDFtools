// import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    // Removed database saving as requested
    // const newMessage = await ContactMessage.create({
    //   name,
    //   email,
    //   message,
    // });

    // Removed email notification as requested
    // Data is only saved to the DB

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, message: 'Failed to submit message, please try again later' });
  }
};
