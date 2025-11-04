import {Platform, StatusBarProps} from 'react-native';
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
  TransportColors,
  TransportColor,
  StatusColors,
  StatusColor,
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

const androidOrIos = Platform.OS === 'android' ? 'android' : 'ios';
export const textTypeStyles = createTextTypeStyles(androidOrIos);

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
    statusBarStyle: 'dark-content',

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
