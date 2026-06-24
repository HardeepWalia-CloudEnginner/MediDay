import { User } from '@/lib/types';

interface SidebarProps {
  user: User;
  collections: string[];
}

export default function Sidebar({ user, collections }: SidebarProps) {
  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      doctor: { bg: '#fff3cd', text: '#856404' },
      nurse: { bg: '#cce5ff', text: '#004085' },
      billing_executive: { bg: '#e2e3e5', text: '#383d41' },
      technician: { bg: '#d1ecf1', text: '#0c5460' },
      admin: { bg: '#f8d7da', text: '#721c24' },
    };
    return colors[role] || { bg: '#e0e0e0', text: '#333' };
  };

  const badgeStyle = getRoleBadgeColor(user.role);

  return (
    <div className="sidebar">
      <div
        className="role-badge"
        style={{
          backgroundColor: badgeStyle.bg,
          color: badgeStyle.text,
          marginBottom: '16px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{user.name}</div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {user.role.replace('_', ' ')}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
          Accessible Collections
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {collections.map((collection, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                borderLeft: '3px solid #0066cc',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#555',
              }}
            >
              {collection}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.4',
        }}
      >
        <strong>About MediBot:</strong>
        <p style={{ marginTop: '8px' }}>
          MediBot provides role-based access to medical information with Hybrid RAG and SQL RAG retrieval methods. All responses include source citations.
        </p>
      </div>
    </div>
  );
}
