/// <reference types="express" />
/// <reference types="passport" />
import express from 'express';
import passport from 'passport';
import 'passport'; // Force Passport type augmentations
import { IUser } from '../types/user.js';

const authController = {
  // Initiates Google OAuth flow
  googleLogin: passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),

  // Handles the Google OAuth callback
  googleCallback: [
    passport.authenticate('google', { failureRedirect: '/login' }),
    (_req: express.Request, res: express.Response) => {
      // Redirect to the frontend after successful login
      res.redirect(
        process.env.PROD_URL ||
          process.env.PREVIEW_URL ||
          'http://localhost:5173'
      );
    },
  ],

  // Returns the currently authenticated user
  getMe: (req: express.Request, res: express.Response) => {
    if (!(req as any).isAuthenticated() || !req.user) {
      return (res as any).json({ user: null });
    }
    const user = req.user as IUser;
    return (res as any).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  },

  // Logs the user out and destroys the session
  logout: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    req.logout((err: any) => {
      if (err) return (next as any)(err);
      // express-session augments req.session with .destroy()
      const s = (
        req as unknown as express.Request & {
          session: { destroy: (cb: () => void) => void };
        }
      ).session;
      s.destroy(() => {
        (res as any).json({ success: true });
      });
    });
  },
};

export default authController;
