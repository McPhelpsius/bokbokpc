import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthError: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const errorMessage = searchParams.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    } else {
      setError('Unknown authentication error occurred');
    }
  }, [searchParams]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div>
        <h2>❌ Authentication Failed</h2>
        <p>There was an error connecting to Yahoo Fantasy Football:</p>
        
        <div style={{ 
          backgroundColor: '#f8d7da', 
          padding: '15px', 
          borderRadius: '5px', 
          margin: '20px 0',
          color: '#721c24'
        }}>
          <strong>Error:</strong> {error}
        </div>
        
        <div>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Go Back to Home
          </button>
          
          <button 
            onClick={() => window.location.href = 'https://localhost:3000/auth/yahoo'}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
