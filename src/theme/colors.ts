import {Platform, StatusBarProps, TextStyle} from 'react-native';
import {APP_ORG} from '@env';

import {
  ContrastColor,
  createExtendedThemes,
  createTextTypeStyles,
  createThemesFor,
  Mode,
  RadiusSizes,
  Statuses,
  TextColor,
  TextNames,
  textNames,
  ThemeVariant,
} from '@atb-as/theme';

export type {Statuses, Mode, TextColor, ContrastColor, RadiusSizes, TextNames};
export {textNames};

const mainThemes = createThemesFor(
  APP_ORG == 'nfk' ? ThemeVariant.Nfk : ThemeVariant.AtB,
);

// Override semibold with bold to avoid Android Roboto bold bug.
// See ttps://github.com/facebook/react-native/issues/25696
const fontWeightFix: TextStyle = {
  fontWeight: Platform.select({
    android: 'bold',
    default: '600',
  }),
};

const androidOrIos = Platform.OS === 'android' ? 'android' : 'ios';
export const textTypeStyles = createTextTypeStyles(androidOrIos, {
  'body__primary--bold': fontWeightFix,
  'body__secondary--bold': fontWeightFix,
  heading__component: fontWeightFix,
  heading__paragraph: fontWeightFix,
  heading__title: fontWeightFix,
});

const tripLegDetail = {
  labelWidth: 80,
  decorationContainerWidth: 20,
  decorationLineEndWidth: 12,
  decorationLineWidth: 4,
};

type AppThemeExtension = {
  statusBarStyle: StatusBarProps['barStyle'];
  tripLegDetail: typeof tripLegDetail;

  typography: typeof textTypeStyles;
};

export const themes = createExtendedThemes<AppThemeExtension>(mainThemes, {
  light: {
    tripLegDetail,
    statusBarStyle: 'light-content',

    typography: textTypeStyles,
  },
  dark: {
    tripLegDetail,
    statusBarStyle: 'light-content',

    typography: textTypeStyles,
  },
});

export type Themes = typeof themes;
export type Theme = Themes['light'];

export type ThemeColor = keyof Theme['colors'];

export const isThemeColor = (
  theme: Theme,
  color?: string,
): color is ThemeColor => {
  return !!color && color in theme.colors;
};
