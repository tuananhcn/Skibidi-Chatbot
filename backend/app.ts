/// <reference types="express" />
/// <reference types="passport" />
import express from 'express';
import session from 'express-session';
import 'express-session'; // Explicitly load session types
import MongoStore from 'connect-mongo';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/db.js';
import './config/passport.js'; // Registers passport strategy
import passport from 'passport';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Database connection middleware (ensures DB is ready for every request)
app.use(async (req: any, _res: any, next: any) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Basic request logger
app.use((req: any, _res: any, next: any) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Validate required environment variables
const requiredEnv = [
  'MONGO_URI',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];
requiredEnv.forEach((name) => {
  if (!process.env[name]) {
    console.error(`CRITICAL: Environment variable ${name} is missing!`);
  }
});

app.set('trust proxy', 1);

// ... (CORS config remains same) ...
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CUSTOM_URL,
  process.env.PREVIEW_URL,
  process.env.PROD_URL,
  process.env.VITE_API_URL, // Explicitly add known Vercel URL
].filter(Boolean) as string[];

app.use(compression());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (must be before passport)
if (process.env.MONGO_URI) {
  app.use(
    session({
      secret: (process.env.SESSION_SECRET as string) || 'fallback-secret-bad',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI as string,
        collectionName: 'sessions',
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );
} else {
  console.warn(
    'Running without persistent sessions because MONGO_URI is missing.'
  );
  app.use(
    session({
      secret: (process.env.SESSION_SECRET as string) || 'fallback-secret-bad',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    })
  );
}

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

console.log(
  'Backend initialized. Registered strategies:',
  (passport as any)._strategies
    ? Object.keys((passport as any)._strategies)
    : 'none'
);

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Global error handler (MUST BE AFTER ROUTES)
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const s = res as any;
    console.error('[Error Handler] Caught error:', err.message);
    console.error(err.stack);
    s.status(500).json({
      status: 'error',
      message: `(Server) ${err.message || 'Something went wrong!'}`,
    });
  }
);

/*******************
 * Run Application *
 *******************/

// Application is ready (Middleware handles connectDB)

// Only listen locally, Vercel Serverless handles its own listening
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// App shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

export default app;
