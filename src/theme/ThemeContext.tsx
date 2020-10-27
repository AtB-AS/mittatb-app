import React, {createContext, useContext, useState} from 'react';
import {themes, Theme, Themes, Mode} from './colors';
import {useColorScheme} from 'react-native';

interface ThemeContextValue {
  theme: Theme;
  themeName: Mode;
  updateTheme(themeKey: keyof Themes): void;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.light,
  themeName: 'light',
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
  const colorScheme = useColorScheme();
  const defaultTheme = colorScheme ?? 'light';
  const [themeName, setThemeName] = useState<keyof Themes>(defaultTheme);
  const toggleTheme = () =>
    setThemeName(themeName === 'dark' ? 'light' : 'dark');
  const updateTheme = (themeKey: keyof Themes) => {
    setThemeName(themeKey);
  };

  const theme = themes[themeName];
  return (
    <ThemeContext.Provider value={{theme, themeName, updateTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
