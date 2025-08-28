import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';


interface SidebarProps {
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/deposit', label: 'Deposit' },
    { to: '/withdrawal', label: 'Withdrawal' },
    { to: '/gold-lock', label: 'Gold Lock' },
    { to: '/transactions', label: 'Transactions' },
  ];

  const adminItems = [
    { to: '/admin', label: 'Admin Dashboard' },
    { to: '/admin/deposits', label: 'Admin Deposits' },
    { to: '/admin/withdrawals', label: 'Admin Withdrawals' },
    { to: '/admin/gold-locks', label: 'Admin Gold Locks' },
    { to: '/admin/transactions', label: 'All Transactions' },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-xl transition-colors font-sans ${
      isActive
        ? 'gold-gradient-bg text-[#222]'
        : 'text-[var(--text)] hover:bg-gold hover:text-[#222]'
    }`;

  return (
    <>
      {/* Hamburger button - only on mobile */}
      <div className="lg:hidden flex fixed top-40 left-2 z-50 w-6">
        <button onClick={() => setMobileOpen(true)} className="bg-[var(--accent-dark)] space-y-1.5">
          <div className="w-4 h-0.5 bg-[var(--accent)]"></div>
          <div className="w-4 h-0.5 bg-[var(--accent)]"></div>
          <div className="w-4 h-0.5 bg-[var(--accent)]"></div>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden m-4 md:block fixed left-0 top-20 h-4/5 w-64 glassy-card shadow-xl z-40 border-r-2 border-gold" style={{ fontFamily: 'var(--font-sans)' }}>
        <div className="p-6 h-full overflow-y-auto">
          <h2 className="text-2xl font-serif mb-8 gold-text drop-shadow-lg">Dashboard</h2>
          <nav className="space-y-4">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass}>{label}</NavLink>
            ))}
            {isAdmin && (
              <>
                <div className="border-t border-gold my-6" />
                <h3 className="text-lg font-serif mb-4 gold-text">Admin</h3>
                {adminItems.map(({ to, label }) => (
                  <NavLink key={to} to={to} className={navLinkClass}>{label}</NavLink>
                ))}
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar and Overlay */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed overflow-y-auto top-0 left-0 w-64 h-full glassy-card z-50 border-r-2 border-gold shadow-xl">
            <div className="flex items-center justify-between px-4 py-2  border-b border-gold">
              <h2 className="text-xl font-serif gold-text">Menu</h2>
              <button onClick={() => setMobileOpen(false)} className="text-gold text-2xl leading-none">
                ×
              </button>
            </div>
            <div className="p-2 overflow-y-auto">
              <nav className="space-y-2">
                {navItems.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </NavLink>
                ))}
                {isAdmin && (
                  <>
                    <div className="border-t border-gold my-2" />
                    <h3 className="text-lg font-serif mb-4 gold-text">Admin</h3>
                    {adminItems.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={navLinkClass}
                        onClick={() => setMobileOpen(false)}
                      >
                        {label}
                      </NavLink>
                    ))}
                  </>
                )}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
