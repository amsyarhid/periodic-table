import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.css';

function Login() {
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/table" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in with your Google account
        </p>

        <div className={styles.button}>
          <GoogleLogin
            onSuccess={({ credential }) => login(credential)}
            onError={() => setError('Google sign-in failed. Please try again.')}
            theme="filled_blue"
            size="large"
            shape="rectangular"
            text="signin_with"
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <Link to="/privacy" className={styles.footerLink}>
          Privacy policy
        </Link>
      </section>
    </main>
  );
}

export default Login;
