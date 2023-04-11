import ChangeNative from '@atb/change-native';
import React, {createContext, useContext, useEffect} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {usePreferences} from '../preferences';
import {Mode, Theme, Themes, themes} from './colors';

interface ThemeContextValue {
  theme: Theme;
  themeName: Mode;

  storedColorScheme: Mode;
  overrideSystemAppearance: boolean;
  useAndroidSystemFont: boolean;

  updateThemePreference(themeKey: keyof Themes): void;
  overrideOSThemePreference(override: boolean): void;
  updateAndroidFontOverride(override: boolean): void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.light,
  themeName: 'light',

  storedColorScheme: 'light',
  overrideSystemAppearance: false,
  useAndroidSystemFont: false,

  updateThemePreference() {},
  overrideOSThemePreference() {},
  updateAndroidFontOverride() {},
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
}

export const ThemeContextProvider: React.FC = ({children}) => {
  const colorScheme = useColorScheme();
  const {
    setPreference,
    preferences: {
      colorScheme: storedColorScheme,
      overrideSystemAppearance,
      useAndroidSystemFont,
    },
  } = usePreferences();

  const actualColorScheme =
    (overrideSystemAppearance ? storedColorScheme : colorScheme) ?? 'light';

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    if (overrideSystemAppearance && colorScheme !== storedColorScheme) {
      ChangeNative.changeAppearance(storedColorScheme);
    }
    if (!overrideSystemAppearance) {
      ChangeNative.changeAppearance(null);
    }
  }, [overrideSystemAppearance, storedColorScheme]);

  const overrideOSThemePreference = (override: boolean) => {
    setPreference({overrideSystemAppearance: override});
  };
  const updateThemePreference = (themeKey: keyof Themes) => {
    setPreference({colorScheme: themeKey});
  };

  const updateFontOverride = (override: boolean) => {
    setPreference({useAndroidSystemFont: override});
  };

  const theme = themes[actualColorScheme];
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName: actualColorScheme,
        storedColorScheme: storedColorScheme ?? 'light',
        overrideSystemAppearance: overrideSystemAppearance ?? false,
        useAndroidSystemFont: !!useAndroidSystemFont,
        updateThemePreference,
        overrideOSThemePreference,
        updateAndroidFontOverride: updateFontOverride,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
