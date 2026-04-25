import { useNavigate } from 'react-router-dom';
import '@src/styles/App.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#ffffff' }}>404</h1>
        <h2 style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.7)' }}>Page Not Found</h2>
        <p style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.5)' }}>
          The path you are looking for doesn&apos;t exist or has been moved.
        </p>
        <button 
          className="send-button" 
          style={{ width: 'auto', padding: '0 2rem', height: '3rem', margin: '0 auto' }}
          onClick={() => navigate('/')}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
