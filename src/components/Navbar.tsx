import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { useToast } from './Toast';
import authService from '../services/authService';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  wallet: {
    balance: number;
    gold_holdings: number;
  };
}

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, [user]);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setUser(authService.getCurrentUser());
        setCurrentUser(authService.getCurrentUser());
      }
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Logged out successfully', 'success');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = (newTheme: 'gold' | 'dark' | 'light') => {
    setTheme(newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 glassy-card border-b-2 border-gold">
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-serif gold-text">
            GoldFlux
          </Link>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 glassy-card border-b-2 border-gold m-2">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold md:text-2xl font-serif gold-text">
          GoldFlux
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex font-bold items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-sans transition ${location.pathname === '/' ? 'gold-text' : 'text-[var(--text)] hover:text-gold'}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-sans transition ${location.pathname === '/about' ? 'gold-text' : 'text-[var(--text)] hover:text-gold'}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-sans transition ${location.pathname === '/contact' ? 'gold-text' : 'text-[var(--text)] hover:text-gold'}`}
          >
            Contact
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => toggleTheme('gold')}
              className={`p-2 rounded-lg transition ${theme === 'gold' ? 'gold-gradient-bg text-[#222]' : 'bg-transparent border border-gold text-gold'}`}
              title="Gold Theme"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM10 4a6 6 0 110 12 6 6 0 010-12z"/>
              </svg>
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`p-2 rounded-lg transition ${theme === 'dark' ? 'gold-gradient-bg text-[#222]' : 'bg-transparent border border-gold text-gold'}`}
              title="Dark Theme"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              onClick={() => toggleTheme('light')}
              className={`p-2 rounded-lg transition ${theme === 'light' ? 'gold-gradient-bg text-[#222]' : 'bg-transparent border border-gold text-gold'}`}
              title="Light Theme"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              {/* Dashboard Icon - Only visible when authenticated */}
              <Link
                to="/dashboard"
                className="p-2 rounded-lg font-bold border-2 border-gold text-gold hover:gold-gradient-bg hover:text-[#222] transition"
                title="Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Link>
              <span className="text-sm font-bold text-[var(--text)] hidden sm:block">
                Welcome, {currentUser?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-gold text-gold hover:gold-gradient-bg hover:text-[#222] transition"
              >
                Logout
              </button>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border-2 border-gold text-gold hover:gold-gradient-bg hover:scale-105 hover:text-[#222] transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border-2 border-gold rounded-lg gold-gradient-bg text-[#222] hover:scale-105 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg border border-gold text-gold transition focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
      <div className="md:hidden glassy-card border-t border-gold absolute top-20 left-0 right-0 z-40 animate-fade-down">
        <div className="flex flex-col px-4 py-4 space-y-3">
          <Link 
            to="/" 
            className={`rounded-lg px-4 py-2 font-sans transition ${location.pathname === '/' ? 'gold-gradient-bg text-[#222]' : 'text-[var(--text)] hover:bg-gold hover:text-[#222]'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`rounded-lg px-4 py-2 font-sans transition ${location.pathname === '/about' ? 'gold-gradient-bg text-[#222]' : 'text-[var(--text)] hover:bg-gold hover:text-[#222]'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`rounded-lg px-4 py-2 font-sans transition ${location.pathname === '/contact' ? 'gold-gradient-bg text-[#222]' : 'text-[var(--text)] hover:bg-gold hover:text-[#222]'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          {isAuthenticated && (
            <>
              <div className="h-[1px] bg-gold my-2" />
              <span className="px-4 py-2 text-sm text-gray-400">
                Welcome, {currentUser?.username}
              </span>
              <Link
                to="/dashboard"
                className="rounded-lg px-4 py-2 text-[var(--text)] hover:bg-gold hover:text-[#222] transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-left w-full rounded-lg px-4 py-2 text-[var(--text)] hover:bg-gold hover:text-[#222] transition"
              >
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="rounded-lg border-2 border-[var(--text)] px-4 py-2 text-[var(--text)] hover:bg-gold hover:text-[#222] transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg px-4 py-2 gold-gradient-bg text-[#222] hover:scale-105 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* Theme Toggle Buttons */}
        <div className="flex px-auto py-2 mb-2 justify-center items-center space-x-2">
          <button
            onClick={() => toggleTheme('gold')}
            className={`p-2 rounded-lg transition ${theme === 'gold' ? 'gold-gradient-bg text-[#222]' : 'bg-[var(--accent)] border border-gold text-gold'}`}
            title="Gold Theme"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM10 4a6 6 0 110 12 6 6 0 010-12z"/>
            </svg>
          </button>
          <button
            onClick={() => toggleTheme('dark')}
            className={`p-2 rounded-lg transition ${theme === 'dark' ? 'gold-gradient-bg text-[#222]' : 'bg-transparent border border-gold text-gold'}`}
            title="Dark Theme"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            onClick={() => toggleTheme('light')}
            className={`p-2 rounded-lg transition ${theme === 'light' ? 'gold-gradient-bg text-[#222]' : 'bg-transparent border border-gold text-gold'}`}
            title="Light Theme"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
            </svg>
          </button>
          </div>
      </div>
    )}

    </nav>
  );
};

export default Navbar; 