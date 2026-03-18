
import React from 'react';

interface SidebarProps {
  isLoggedIn: boolean;
}

const navItems = [
  {
    label: 'Leaderboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="12" width="4" height="8" rx="1" />
        <rect x="9" y="8" width="4" height="12" rx="1" />
        <rect x="15" y="4" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Badges',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-2.5L7 19l1-6-4-4 5.5-1.5L12 2z" />
        <circle cx="12" cy="10" r="2.5" fill="currentColor" stroke="none" opacity="0.4" />
      </svg>
    ),
  },
  {
    label: 'Apex AI',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="4" y="8" width="16" height="12" rx="3" />
        <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none" />
        <path d="M12 2v4M9 8V6M15 8V6" />
        <path d="M8 20v2M16 20v2" />
      </svg>
    ),
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isLoggedIn }) => {
  return (
    <aside className="w-56 shrink-0 bg-black border-r border-rh-yellow/30 sticky top-[64px] h-[calc(100vh-64px)] flex flex-col">

      {/* Nav items */}
      <div className="pt-6 px-3 flex flex-col gap-1">
        <p className="text-[9px] font-black text-rh-yellow/40 uppercase tracking-[0.25em] px-3 mb-2">Navigation</p>
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-rh-yellow/10 transition-all group cursor-pointer w-full text-left"
          >
            <span className="text-rh-yellow/70 group-hover:text-rh-yellow transition-colors shrink-0">
              {item.icon}
            </span>
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Profile section */}
      <div className="mt-auto border-t border-rh-yellow/20">
        <button className="w-full flex items-center space-x-3 p-4 hover:bg-rh-yellow/10 transition-all group cursor-pointer text-left">
          <div className="w-9 h-9 rounded-full bg-rh-dark border border-rh-yellow/30 flex items-center justify-center shrink-0 group-hover:border-rh-yellow/60 transition-colors">
            {isLoggedIn ? (
              <svg className="w-4 h-4 text-rh-yellow/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-rh-gray/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {isLoggedIn ? 'Your Profile' : 'Sign in'}
            </p>
            <p className="text-[10px] text-rh-gray/60 truncate">
              {isLoggedIn ? 'View stats & settings' : 'To access your profile'}
            </p>
          </div>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
