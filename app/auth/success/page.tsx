'use client';

import { Suspense, useEffect, use, Context } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function AuthSuccessPage({searchParams}: {searchParams: Context<unknown>}) {
const router = useRouter();
  const params = use(searchParams) as URLSearchParams;

  function setTokensInLocalStorage(access_token: string, refresh_token: string) {
    localStorage.setItem('yahoo_access_token', access_token);
      localStorage.setItem('yahoo_refresh_token', refresh_token);
  }

  useEffect(() => {
    console.log(searchParams)
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      setTokensInLocalStorage(accessToken, refreshToken)
    }


    setTimeout(() => {
      router.push('/');
    }, 2000);
      // console.log('Tokens stored successfully!');
      // setStatus('success');
      
      // Redirect to home after a delay
      // setTimeout(() => {
      //   navigate('/');
      // }, 2000);
    // } else {
    //   console.error('Missing tokens in callback');
    //   setStatus('error');
    // }
  }, [router, params, searchParams]);
  // useEffect(() => {
  //   console.log(searchParams)
  //   const accessToken = searchParams.get('access_token');
  //   const refreshToken = searchParams.get('refresh_token');

  //   if (accessToken && refreshToken) {
  //     // Store tokens
  //     localStorage.setItem('yahoo_access_token', accessToken);
  //     localStorage.setItem('yahoo_refresh_token', refreshToken);

  //     setTimeout(() => {
  //       router.push('/');
  //     }, 2000);
  //   }
  //     // console.log('Tokens stored successfully!');
  //     // setStatus('success');
      
  //     // Redirect to home after a delay
  //     // setTimeout(() => {
  //     //   navigate('/');
  //     // }, 2000);
  //   // } else {
  //   //   console.error('Missing tokens in callback');
  //   //   setStatus('error');
  //   // }
  // }, [router, searchParams]);
  //   // Small delay to allow auth context to process tokens from URL
  //   const timer = setTimeout(() => {
  //     if (isAuthenticated) {
  //       // Get the return URL or default to home
  //       const returnUrl = localStorage.getItem('auth_return_url') || '/';
  //       localStorage.removeItem('auth_return_url');
        
  //       console.log('Authentication successful, redirecting to:', returnUrl);
        // router.push('/');
  //     } else if (!isLoading) {
  //       // If not authenticated after processing, something went wrong
  //       router.push('/auth/error?error=Authentication failed');
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []]);


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
