import React, { createContext, useContext, useEffect, useState } from 'react';
import { sounds } from '../utils/soundEffects';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
  soundEnabled: true,
  toggleSound: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('evento_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'light'; // Default to light mode (with crisp white background)
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sounds.isEnabled());

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      body.style.backgroundColor = '#090d16';
      body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#0f172a';
    }

    try {
      localStorage.setItem('evento_theme', theme);
    } catch {
      // ignore
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      sounds.playThemeToggle(next === 'dark');
      return next;
    });
  };

  const setTheme = (mode: ThemeMode) => {
    sounds.playThemeToggle(mode === 'dark');
    setThemeState(mode);
  };

  const toggleSound = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme, soundEnabled, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
