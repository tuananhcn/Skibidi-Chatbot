import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
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

const app: Express = express();

app.set('trust proxy', 1);

// CORS config based on environment
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CUSTOM_URL,
  process.env.PREVIEW_URL,
  process.env.PROD_URL,
].filter(Boolean) as string[];

/************************
 * App Middleware Setup *
 ************************/

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
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
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

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: '(Server) Something went wrong!',
  });
});

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

/*******************
 * Run Application *
 *******************/

connectDB();

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
