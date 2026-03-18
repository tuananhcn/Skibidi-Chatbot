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
    (req: any, res: any, next: any) => {
      const isProduction =
        process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const failureRedirect = isProduction
        ? '/login'
        : 'http://localhost:5173/login';

      passport.authenticate('google', {
        failureRedirect: failureRedirect,
      })(req, res, next);
    },
    (_req: express.Request, res: express.Response) => {
      const s = res as any;
      const isProduction =
        process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const redirectUrl = isProduction ? '/' : 'http://localhost:5173';

      console.log(`[OAuth] Success! Redirecting to: ${redirectUrl}`);
      // Redirect to the frontend after successful login
      s.redirect(redirectUrl);
    },
  ],

  // Returns the currently authenticated user
  getMe: (req: express.Request, res: express.Response) => {
    const q = req as any;
    const s = res as any;
    if (!q.isAuthenticated() || !q.user) {
      return s.json({ user: null });
    }
    const user = q.user as IUser;
    return s.json({
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
    const q = req as any;
    const s = res as any;
    q.logout((err: any) => {
      if (err) return (next as any)(err);
      // express-session augments req.session with .destroy()
      const sess = q.session;
      if (sess && sess.destroy) {
        sess.destroy(() => {
          s.json({ success: true });
        });
      } else {
        s.json({ success: true });
      }
    });
  },
};

export default authController;
