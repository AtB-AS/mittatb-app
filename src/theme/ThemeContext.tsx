import {changeAppearance} from '@atb/modules/native-bridges';
import React, {createContext, useContext, useEffect} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {usePreferencesContext} from '@atb/modules/preferences';
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

export const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.light,
  themeName: 'light',

  storedColorScheme: 'light',
  overrideSystemAppearance: false,
  useAndroidSystemFont: false,

  updateThemePreference() {},
  overrideOSThemePreference() {},
  updateAndroidFontOverride() {},
});

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
}

type Props = {
  children: React.ReactNode;
};

export const ThemeContextProvider = ({children}: Props) => {
  const colorScheme = useColorScheme();
  const {
    setPreference,
    preferences: {
      colorScheme: storedColorScheme,
      overrideSystemAppearance,
      useAndroidSystemFont,
    },
  } = usePreferencesContext();

  const actualColorScheme =
    (overrideSystemAppearance ? storedColorScheme : colorScheme) ?? 'light';

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    if (overrideSystemAppearance && colorScheme !== storedColorScheme) {
      changeAppearance(storedColorScheme);
    }
    if (!overrideSystemAppearance) {
      changeAppearance(null);
    }
  }, [overrideSystemAppearance, storedColorScheme, colorScheme]);

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
