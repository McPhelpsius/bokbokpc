'use client';

import { Suspense, useEffect, useState, Context, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function AuthErrorPage({searchParams}: {searchParams: Context<unknown>}) {
  const router = useRouter();
  const params = use(searchParams) as URLSearchParams;
  
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const errorParam = params.get('error');
    setError(errorParam || 'An unknown error occurred during authentication');
  }, [router, params]);


  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <h1>Authentication Failed</h1>
          <p className={styles.errorMessage}>
            {error}
          </p>
          
          <div className={styles.suggestions}>
            <h3>Possible solutions:</h3>
            <ul>
              <li>Make sure you have a Yahoo account</li>
              <li>Check that you allowed the application access</li>
              <li>Try clearing your browser cache</li>
              <li>Make sure you&apos;re connected to the internet</li>
            </ul>
          </div>

          <div className={styles.actions}>
            {/* <button 
              className={styles.retryButton}
              onClick={handleRetry}
            >
              Try Again
            </button> */}
            <button 
              className={styles.homeButton}
              onClick={handleGoHome}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
    </Suspense>
  );
}
