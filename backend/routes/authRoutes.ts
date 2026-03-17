import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Initiates Google OAuth
router.get('/google', authController.googleLogin);

// Google OAuth callback
router.get('/google/callback', ...authController.googleCallback);

// Get the currently logged-in user
router.get('/me', authController.getMe);

// Logout
router.post('/logout', authController.logout);

export default router;
