import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../config/email.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        theme: user.theme,
        totalPoints: user.totalPoints
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        theme: user.theme,
        totalPoints: user.totalPoints
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, theme } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, theme },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile photo
router.put('/profile-photo', authenticateToken, async (req, res) => {
  try {
    console.log('📸 Profile photo update request received');
    console.log('User ID from token:', req.user?.userId);
    console.log('Request body keys:', Object.keys(req.body));
    
    const { profilePhoto } = req.body;

    if (!profilePhoto) {
      console.log('❌ No profile photo provided');
      return res.status(400).json({ message: 'Profile photo URL is required' });
    }

    console.log('📸 Updating profile photo for user:', req.user.userId);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePhoto },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Profile photo updated successfully');
    res.json({
      message: 'Profile photo updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot password - Generate reset token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, a reset code has been generated.',
        success: true 
      });
    }

    // Generate 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the token before saving
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token and expiry (15 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    console.log(`🔑 Password reset code for ${email}: ${resetToken}`);
    
    // Send email with reset code
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      console.log(`📧 Reset code sent to ${user.email}`);
      
      res.json({
        message: 'Password reset code has been sent to your email',
        success: true,
        email: user.email
      });
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      
      // Return error - email must work
      res.status(500).json({
        message: 'Failed to send email. Please try again later.',
        success: false,
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: error.message });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ message: 'Email, reset code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the provided token
    const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`✅ Password reset successful for ${email}`);

    res.json({ 
      message: 'Password reset successful. You can now log in with your new password.',
      success: true 
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;