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
  TextNames,
  createTextTypeStyles,
  textNames,
  backgrounds,
} from '@atb-as/theme';

export default colors;
export type {Statuses, Mode, TextColor, ContrastColor, RadiusSizes, TextNames};
export {defaultTextColors, textNames};

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
      header: colors.secondary.blue_900,
      destructive: colors.secondary.red_500,
      accent: backgrounds.dark.level1,
    },

    typography: textTypeStyles,
  },
});

export type Themes = typeof themes;
export type Theme = Themes['light'];
