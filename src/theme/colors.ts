import {Platform, StatusBarProps, TextStyle} from 'react-native';

import {
  colors,
  createExtendedThemes,
  Statuses,
  Mode,
  TextColor,
  ContrastColor,
  RadiusSizes,
  defaultTextColors,
} from '@atb-as/theme';

export default colors;
export type {Statuses, Mode, TextColor, ContrastColor, RadiusSizes};
export {defaultTextColors};

export const textNames = [
  'body__primary--jumbo',
  'body__primary--bold',
  'body__primary',
  'body__primary--underline',
  'body__secondary',
  'body__tertiary',
] as const;

export type TextNames = typeof textNames[number];

export const textTypeStyles: {[key in TextNames]: TextStyle} = {
  'body__primary--jumbo': {fontSize: 32, lineHeight: 40},
  'body__primary--bold': {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: Platform.select({
      android: 'bold',
      default: '600',
    }),
  },
  body__primary: {fontSize: 16, lineHeight: 20},
  'body__primary--underline': {
    fontSize: 16,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  body__secondary: {fontSize: 14, lineHeight: 20},
  body__tertiary: {fontSize: 12, lineHeight: 16},
};

const tripLegDetail = {
  labelWidth: 80,
  decorationContainerWidth: 20,
  decorationLineEndWidth: 12,
  decorationLineWidth: 4,
};

type AppThemeExtension = {
  statusBarStyle: StatusBarProps['barStyle'];
  tripLegDetail: typeof tripLegDetail;

  background: {
    header: string;
    destructive: string;
    accent: string;
  };

  typography: typeof textTypeStyles;
};

export const themes = createExtendedThemes<AppThemeExtension>({
  light: {
    tripLegDetail,
    statusBarStyle: 'dark-content',

    background: {
      header: colors.secondary.cyan_500,
      destructive: colors.secondary.red_500,
      accent: colors.secondary.cyan_500,
    },

    typography: textTypeStyles,
  },
  dark: {
    tripLegDetail,
    statusBarStyle: 'light-content',

    background: {
      header: colors.secondary.cyan_500,
      destructive: colors.secondary.red_500,
      accent: colors.secondary.cyan_500,
    },

    typography: textTypeStyles,
  },
});

export type Themes = typeof themes;
export type Theme = Themes['light'];
