import React from 'react';
import Sidebar from '../components/Sidebar';
interface DashboardLayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, isAdmin }) => {
  return (
    <div className="min-h-screen flex gold-gradient-bg" style={{ fontFamily: 'var(--font-sans)' }}>
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 pt-20 p-4 lg:ml-64">{children}</main>
    </div>
  );
};
export default DashboardLayout; 