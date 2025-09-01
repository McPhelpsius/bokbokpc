import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('yahoo_access_token', accessToken);
      localStorage.setItem('yahoo_refresh_token', refreshToken);
      
      console.log('Tokens stored successfully!');
      setStatus('success');
      
      // Redirect to home after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      console.error('Missing tokens in callback');
      setStatus('error');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      {status === 'processing' && (
        <div>
          <h2>🔄 Processing Authentication...</h2>
          <p>Please wait while we complete your Yahoo Fantasy connection.</p>
        </div>
      )}
      
      {status === 'success' && (
        <div>
          <h2>✅ Authentication Successful!</h2>
          <p>You have been successfully connected to Yahoo Fantasy Football.</p>
          <p>Redirecting you back to the main page...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <h2>❌ Authentication Failed</h2>
          <p>Something went wrong with the authentication process.</p>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthSuccess;
