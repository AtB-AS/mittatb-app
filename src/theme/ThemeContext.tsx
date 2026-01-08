import {changeAppearance} from '@atb/modules/native-bridges';
import React, {createContext, useContext, useEffect} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {usePreferencesContext} from '@atb/modules/preferences';
import {Mode, Theme, themes} from './colors';
import {ChangeAppearance} from '@atb/specs/NativeChangeAppearance';

export enum AppearanceSelection {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

interface ThemeContextValue {
  theme: Theme;
  themeName: Mode;

  appearanceSelection: AppearanceSelection;
  setAppearanceSelection(selection: AppearanceSelection): void;

  /**
   * Whether to use the Android device's system font instead of the one set by
   * the design system.
   */
  androidSystemFont: boolean;
  setAndroidSystemFont(override: boolean): void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.light,
  themeName: 'light',

  appearanceSelection: AppearanceSelection.SYSTEM,
  setAppearanceSelection() {},

  androidSystemFont: false,
  setAndroidSystemFont() {},
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
  const systemColorScheme = useColorScheme();
  const systemColorWithFallback =
    systemColorScheme === 'unspecified' ? 'light' : systemColorScheme;
  const {
    setPreference,
    preferences: {colorScheme, overrideSystemAppearance, useAndroidSystemFont},
  } = usePreferencesContext();
  const androidSystemFont = !!useAndroidSystemFont;

  const themeName: Mode =
    (overrideSystemAppearance ? colorScheme : systemColorWithFallback) ??
    'light';

  const appearanceSelection = overrideSystemAppearance
    ? colorScheme === 'dark'
      ? AppearanceSelection.DARK
      : AppearanceSelection.LIGHT
    : AppearanceSelection.SYSTEM;

  const setAppearanceSelection = (selection: AppearanceSelection) => {
    switch (selection) {
      case AppearanceSelection.SYSTEM:
        setPreference({
          overrideSystemAppearance: false,
        });
        break;
      case AppearanceSelection.DARK:
        setPreference({
          overrideSystemAppearance: true,
          colorScheme: 'dark',
        });
        break;
      case AppearanceSelection.LIGHT:
        setPreference({
          overrideSystemAppearance: true,
          colorScheme: 'light',
        });
        break;
    }
  };

  const setAndroidSystemFont = (value: boolean) => {
    setPreference({useAndroidSystemFont: value});
  };

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    if (overrideSystemAppearance && systemColorScheme !== colorScheme) {
      ChangeAppearance.changeAppearance(colorScheme ?? null);
      // changeAppearance(colorScheme);
    }
    if (!overrideSystemAppearance) {
      // changeAppearance(null);
      ChangeAppearance.changeAppearance(null);
    }
  }, [overrideSystemAppearance, colorScheme, systemColorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme: themes[themeName],
        appearanceSelection,
        setAppearanceSelection,
        androidSystemFont,
        setAndroidSystemFont,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
