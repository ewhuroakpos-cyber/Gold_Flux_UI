import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import authService from './services/authService';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import GoldLock from './pages/GoldLock';
import Transactions from './pages/Transactions';
import AdminDashboard from './pages/AdminDashboard';
import AdminTransactions from './pages/admin/AdminTransactions';
import GoldLocksAdmin from './pages/admin/GoldLocksAdmin';
import DepositsAdmin from './pages/admin/DepositsAdmin';
import WithdrawalsAdmin from './pages/admin/WithdrawalsAdmin';


// Component to determine if sidebar should be shown
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  
  // Show sidebar only on authenticated pages
  const showSidebar = isAuthenticated && (
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/deposit') ||
    location.pathname.startsWith('/withdrawal') ||
    location.pathname.startsWith('/gold-lock') ||
    location.pathname.startsWith('/transactions') ||
    location.pathname.startsWith('/admin')
  );

  return (
    <div className="App min-h-screen" style={{ color: 'var(--text)' }}>
      <Navbar />
      <div className="flex min-h-screen">
        {showSidebar && <Sidebar isAdmin={isAdmin} />}
        <main 
          className={`flex-1 transition-all duration-300 ${
            showSidebar 
              ? 'pt-20 lg:ml-64 lg:pl-8 lg:pr-8' 
              : 'pt-16 md:pt-20 px-10'
          }`}
        >
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <LayoutWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/deposit" 
                element={
                  <ProtectedRoute>
                    <Deposit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/withdrawal" 
                element={
                  <ProtectedRoute>
                    <Withdrawal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gold-lock" 
                element={
                  <ProtectedRoute>
                    <GoldLock />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/transactions" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminTransactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/gold-locks" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <GoldLocksAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/deposits" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <DepositsAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/withdrawals" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <WithdrawalsAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LayoutWrapper>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
