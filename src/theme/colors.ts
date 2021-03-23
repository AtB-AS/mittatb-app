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
  'heroTitle',
  'pageTitle',
  'sectionHeadline',
  'itemHeadline',
  'paragraphHeadline',
  'body',
  'body__link',
  'lead',
  'label',
  'label__link',
] as const;

export type TextNames = typeof textNames[number];

export const textTypeStyles: {[key in TextNames]: TextStyle} = {
  heroTitle: {fontSize: 32, lineHeight: 40},
  pageTitle: {fontSize: 26, lineHeight: 32},
  sectionHeadline: {fontSize: 23, lineHeight: 28},
  itemHeadline: {fontSize: 20, lineHeight: 24},
  paragraphHeadline: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: Platform.select({
      android: 'bold',
      default: '600',
    }),
  },
  body: {fontSize: 16, lineHeight: 20},
  body__link: {fontSize: 16, lineHeight: 20, textDecorationLine: 'underline'},
  lead: {fontSize: 14, lineHeight: 20},
  label: {fontSize: 12, lineHeight: 16},
  label__link: {fontSize: 12, lineHeight: 16, textDecorationLine: 'underline'},
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
