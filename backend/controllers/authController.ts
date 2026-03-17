import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../types/user.js';

const authController = {
  // Initiates Google OAuth flow
  googleLogin: passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),

  // Handles the Google OAuth callback
  googleCallback: [
    passport.authenticate('google', { failureRedirect: '/login' }),
    (_req: Request, res: Response) => {
      // Redirect to the frontend after successful login
      res.redirect(
        process.env.PROD_URL ||
          process.env.PREVIEW_URL ||
          'http://localhost:5173'
      );
    },
  ],

  // Returns the currently authenticated user
  getMe: (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.json({ user: null });
    }
    const user = req.user as IUser;
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  },

  // Logs the user out and destroys the session
  logout: (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      // express-session augments req.session with .destroy()
      const s = (req as Request & { session: { destroy: (cb: () => void) => void } }).session;
      s.destroy(() => {
        res.json({ success: true });
      });
    });
  },
};

export default authController;

