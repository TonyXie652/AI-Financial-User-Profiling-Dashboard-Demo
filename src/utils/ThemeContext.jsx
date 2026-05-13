import { createContext, useContext, useCallback, useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext({
  currentTheme: 'light',
  changeCurrentTheme: () => {},
});

function getTimeBasedTheme() {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6 ? 'dark' : 'light';
}

function getInitialTheme() {
  return localStorage.getItem('theme') || getTimeBasedTheme();
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
}

export default function ThemeProvider({children}) {  
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const changeCurrentTheme = useCallback((newTheme) => {
    localStorage.setItem('theme', newTheme);

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      });
      return;
    }

    document.documentElement.classList.add('theme-transition');
    setTheme(newTheme);
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 260);
  }, []);

  return <ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>{children}</ThemeContext.Provider>;
}

export const useThemeProvider = () => useContext(ThemeContext);
