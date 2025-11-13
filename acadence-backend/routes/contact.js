// routes/contact.js
import express from 'express';
const router = express.Router();

// In-memory storage for contact messages (you can replace with database later)
const contactMessages = [];

// POST /api/contact - Submit a contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, query } = req.body;

    // Validation
    if (!name || !email || !query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and query' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Store the message
    const message = {
      id: Date.now().toString(),
      name,
      email,
      query,
      createdAt: new Date(),
      read: false
    };

    contactMessages.push(message);

    console.log('📧 New contact message received:');
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${query}`);

    // TODO: You can add email notification here using nodemailer
    // Send email to admin about new contact message

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: { id: message.id }
    });

  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// GET /api/contact - Get all contact messages (admin only - you can add auth middleware)
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: contactMessages.length,
      messages: contactMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages' 
    });
  }
});

export default router;
