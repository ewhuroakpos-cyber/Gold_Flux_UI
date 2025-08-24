import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'gold' | 'dark' | 'light';
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'gold', setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'gold';
  });
  useEffect(() => {
    document.documentElement.classList.remove('theme-gold', 'theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const setTheme = (t: Theme) => setThemeState(t);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 