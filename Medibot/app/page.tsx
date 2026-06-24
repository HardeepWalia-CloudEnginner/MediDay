'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateCredentials, storeUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate credentials
    const user = validateCredentials(username, password);
    if (user) {
      storeUser(user);
      router.push('/chat');
    } else {
      setError('Invalid username or password. Please try a demo account.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>MediBot</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Demo Accounts:</p>
          <ul>
            <li><strong>Doctor:</strong> dr.mehta / doctor</li>
            <li><strong>Nurse:</strong> nurse.priya / nurse</li>
            <li><strong>Billing:</strong> billing.ravi / billing_executive</li>
            <li><strong>Technician:</strong> tech.anand / technician</li>
            <li><strong>Admin:</strong> admin.sys / admin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
