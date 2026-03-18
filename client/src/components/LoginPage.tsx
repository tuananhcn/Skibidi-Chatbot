import '@src/styles/LoginPage.css';

const LoginPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL as string;

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.08" />
            <path
              d="M20 10 C14.477 10 10 14.477 10 20 C10 25.523 14.477 30 20 30 C25.523 30 30 25.523 30 20 C30 14.477 25.523 10 20 10Z"
              fill="none"
              stroke="white"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
            <path
              d="M20 14 L22.5 19 L28 19.5 L24 23.5 L25.5 29 L20 26 L14.5 29 L16 23.5 L12 19.5 L17.5 19 Z"
              fill="white"
              fillOpacity="0.9"
            />
          </svg>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to continue to Jawuan GPT</p>

        <a
          href={`${apiUrl}/api/auth/google`}
          className="google-signin-btn"
          aria-label="Sign in with Google"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </a>

        <p className="login-terms">
          By signing in, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
