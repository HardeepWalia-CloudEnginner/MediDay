'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '32px', color: '#d32f2f', margin: 0 }}>Something went wrong!</h1>
      <p style={{ fontSize: '16px', color: '#666', margin: 0, maxWidth: '500px' }}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: '16px',
          padding: '12px 24px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Try again
      </button>
    </div>
  );
}
