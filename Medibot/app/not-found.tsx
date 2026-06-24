import Link from 'next/link';

export default function NotFound() {
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
      }}
    >
      <h1 style={{ fontSize: '48px', color: '#333', margin: 0 }}>404</h1>
      <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>Page not found</p>
      <Link
        href="/"
        style={{
          marginTop: '16px',
          padding: '12px 24px',
          backgroundColor: '#0066cc',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: '500',
        }}
      >
        Go to Login
      </Link>
    </div>
  );
}
