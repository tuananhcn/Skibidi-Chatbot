import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import User from '../models/User.js';
import { IUser } from '../types/user.js';

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Use a relative URL for the callback. With proxy: true and trust proxy: 1,
// Passport will automatically prefix this with the correct protocol and domain.
const callbackURL = '/api/auth/google/callback';

console.log(
  `Configuring Google Strategy with relative callback: ${callbackURL}`
);

if (!clientID || !clientSecret) {
  console.error('CRITICAL: Google OAuth credentials missing in passport.ts');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID || 'missing',
      clientSecret: clientSecret || 'missing',
      callbackURL: callbackURL,
      proxy: true,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        console.log(`[OAuth] Received profile for ID: ${profile.id}`);
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          console.log(
            `[OAuth] User not found, creating new account for: ${profile.displayName}`
          );
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value ?? '',
            name: profile.displayName,
            picture: profile.photos?.[0]?.value ?? '',
          });
          console.log(`[OAuth] Successfully created user with ID: ${user._id}`);
        } else {
          console.log(`[OAuth] Existing user found with ID: ${user._id}`);
        }

        return done(null, user);
      } catch (err) {
        console.error('[OAuth] Error in verify callback:', err);
        return done(err as Error);
      }
    }
  ) as any
);

passport.serializeUser((user: any, done) => {
  try {
    console.log(`[Passport] Serializing user: ${user._id}`);
    done(null, user._id);
  } catch (err) {
    console.error('[Passport] Serialization error:', err);
    done(err);
  }
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error(`[Passport] Deserialization error for ID ${id}:`, err);
    done(err);
  }
});

export default passport;
