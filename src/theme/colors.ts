import {Platform, StatusBarProps, TextStyle} from 'react-native';
import {APP_ORG} from '@env';

import {
  createExtendedThemes,
  createTextTypeStyles,
  createThemesFor,
  StatusColorName,
  TextColor,
  ThemeVariant,
} from '@atb-as/theme';
import {AppOrgs} from '../../types/app-orgs';

export type {
  StatusColorName as Statuses,
  Mode,
  TextColor,
  ContrastColor,
  TextNames,
  InteractiveColor,
  TransportColors as TransportColor,
  StatusColors as StatusColor,
} from '@atb-as/theme';

export {textNames} from '@atb-as/theme';

const appOrgToThemeVariant = (appOrg: AppOrgs): ThemeVariant => {
  switch (appOrg) {
    case 'nfk':
      return ThemeVariant.Nfk;
    case 'fram':
      return ThemeVariant.FRAM;
    case 'troms':
      return ThemeVariant.Troms;
    case 'atb':
    default:
      return ThemeVariant.AtB;
  }
};

const mainThemes = createThemesFor(appOrgToThemeVariant(APP_ORG));

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

export const isStatusColor = (
  color: unknown,
  theme: Theme,
): color is StatusColorName =>
  Object.keys(theme.color.status).includes(color as string);
export const isTextColor = (color: unknown, theme: Theme): color is TextColor =>
  Object.keys(theme.color.foreground.dynamic).includes(color as string);

export type Themes = typeof themes;
export type Theme = Themes['light'];
