import ChangeNative from '@atb/change-native';
import React, {createContext, useContext, useEffect} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {usePreferences} from '../preferences';
import {Mode, Theme, Themes, themes} from './colors';

interface ThemeContextValue {
  theme: Theme;
  themeName: Mode;

  storedColorScheme: Mode;
  overrideColorScheme: boolean;

  updateThemePreference(themeKey: keyof Themes): void;
  overrideOSThemePreference(override: boolean): void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.light,
  themeName: 'light',

  storedColorScheme: 'light',
  overrideColorScheme: false,

  updateThemePreference() {},
  overrideOSThemePreference() {},
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
  const {
    setPreference,
    preferences: {colorScheme: storedColorScheme, overrideColorScheme},
  } = usePreferences();

  const actualColorScheme =
    (overrideColorScheme ? storedColorScheme : colorScheme) ?? 'light';

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    if (overrideColorScheme && colorScheme !== storedColorScheme) {
      ChangeNative.changeAppearance(storedColorScheme);
    }
    if (!overrideColorScheme) {
      ChangeNative.changeAppearance(null);
    }
  }, [colorScheme, overrideColorScheme, storedColorScheme]);

  const overrideOSThemePreference = (override: boolean) => {
    setPreference({overrideColorScheme: override});
  };
  const updateThemePreference = (themeKey: keyof Themes) => {
    setPreference({colorScheme: themeKey});
  };
  const theme = themes[actualColorScheme];
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName: actualColorScheme,
        storedColorScheme: storedColorScheme ?? 'light',
        overrideColorScheme: overrideColorScheme ?? false,
        updateThemePreference,
        overrideOSThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
