import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {usePreferenceItems} from '../preferences';
import {Mode, Theme, themes, Themes} from './colors';

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
  let colorScheme = useColorScheme();
  const {
    colorScheme: storedColorScheme,
    overrideColorScheme,
  } = usePreferenceItems();

  if (overrideColorScheme && storedColorScheme) {
    colorScheme = storedColorScheme;
  }
  const defaultTheme = colorScheme ?? 'light';
  const [themeName, setThemeName] = useState<keyof Themes>(defaultTheme);

  useEffect(() => {
    if (!!colorScheme) {
      setThemeName(colorScheme);
    }
  }, [colorScheme]);

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
