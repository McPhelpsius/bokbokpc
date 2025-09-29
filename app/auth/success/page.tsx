'use client';

import { Suspense, useEffect, use, Context } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function AuthSuccessPage({searchParams}: {searchParams: Context<{access_token?: string, refresh_token?: string}>}) {
const router = useRouter();
  const params = use(searchParams) as {access_token?: string, refresh_token?: string};

  function setTokensInLocalStorage(access_token: string, refresh_token: string) {
    localStorage.setItem('yahoo_access_token', access_token);
      localStorage.setItem('yahoo_refresh_token', refresh_token);
  }

  useEffect(() => {
    const accessToken = params.access_token;
    const refreshToken = params.refresh_token;

    if (accessToken) {
      localStorage.setItem('yahoo_access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('yahoo_refresh_token', refreshToken);
    }


    setTimeout(() => {
      router.push('/');
    }, 2000);
  }, [router, params, searchParams]);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.success}>
          <div className={styles.checkmark}>✓</div>
          <h1>Authentication Successful!</h1>
          <p>
            { 
              'Processing your authentication...' 
            }
          </p>
          <div className={styles.spinner}>
            <div className={styles.spinnerInner}></div>
          </div>
        </div>
      </div>
    </div>
    </Suspense>
  );
}
