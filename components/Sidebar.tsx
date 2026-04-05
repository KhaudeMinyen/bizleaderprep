
import React from 'react';

interface SidebarProps {
  isLoggedIn: boolean;
  onBack: () => void;
}

const navItems = [
  {
    label: 'All Events',
    badge: '17',
    active: true,
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    label: 'Leaderboard',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
      </svg>
    ),
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isLoggedIn, onBack }) => {
  return (
    <>
      <style>{`
        .sb-nav-item { display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:all 0.15s;color:#666;font-size:13.5px;font-weight:400;user-select:none;background:transparent;border:none;width:100%;text-align:left;font-family:'DM Sans',sans-serif; }
        .sb-nav-item:hover { background:#181818;color:#aaa; }
        .sb-nav-item.active { background:rgba(0,255,106,0.08);color:#00ff6a;font-weight:500; }
      `}</style>

      <aside style={{
        width: 256, minWidth: 256, height: '100vh', background: '#111',
        borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Logo */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 12, height: 57 }}>
          <img src="/TransparentLogo.png" alt="BizLeaderPrep" style={{ height: 34, width: 'auto', flexShrink: 0 }} />
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#f0f0f0', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#00ff6a' }}>Biz</span>LeaderPrep
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.4px', color: '#666', textTransform: 'uppercase', padding: '10px 10px 5px', marginTop: 4 }}>
            Study
          </div>

          {navItems.map((item) => (
            <button key={item.label} className={`sb-nav-item${item.active ? ' active' : ''}`}>
              <span style={{ width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.9 }}>
                {item.icon}
              </span>
              {item.label}
              {item.badge && (
                <span style={{ marginLeft: 'auto', background: '#00ff6a', color: '#000', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, lineHeight: 1.6 }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div style={{ height: 1, background: '#222', margin: '8px 0' }}></div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.4px', color: '#666', textTransform: 'uppercase', padding: '10px 10px 5px' }}>
            Organization
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(0,255,106,0.08)', color: '#00ff6a', fontSize: 13.5, fontWeight: 500 }}>
            <span style={{ fontSize: 15 }}>📗</span>
            FBLA Middle School
            <span style={{ marginLeft: 'auto', background: '#00ff6a', color: '#000', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, lineHeight: 1.6 }}>MS</span>
          </div>

          <div style={{ height: 1, background: '#222', margin: '8px 0' }}></div>

          <button onClick={onBack} className="sb-nav-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to home
          </button>
        </nav>

        {/* User section */}
        <div style={{ padding: '12px', borderTop: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, background: '#181818', cursor: 'pointer', border: '1px solid #222' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#00ff6a,#00aaff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000', flexShrink: 0 }}>
              {isLoggedIn ? '✓' : '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>{isLoggedIn ? 'Your Profile' : 'Sign in'}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{isLoggedIn ? 'View stats & settings' : 'To save progress'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
