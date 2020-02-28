import React, {createContext, useContext, useState} from 'react';
import {themes, Theme, Themes} from './colors';
import {lightFormat} from 'date-fns';

interface ThemeContextValue {
  theme: Theme;
  updateTheme(themeKey: keyof Themes): void;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.light,
  updateTheme() {},
  toggleTheme() {},
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
}

const ThemeContextProvider: React.FC = ({children}) => {
  const [themeName, setThemeName] = useState<keyof Themes>('light');
  const toggleTheme = () =>
    setThemeName(themeName === 'dark' ? 'light' : 'dark');
  const updateTheme = (themeKey: keyof Themes) => {
    setThemeName(themeKey);
  };

  const theme = themes[themeName];
  return (
    <ThemeContext.Provider value={{theme, updateTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
