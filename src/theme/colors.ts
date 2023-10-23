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
import {Flattened, flattenObject} from '@atb/utils/object';
import {AppOrgs} from '../../types/app-orgs';

export type {Statuses, Mode, TextColor, ContrastColor, RadiusSizes, TextNames};
export {textNames};

const appOrgToThemeVariant = (appOrg: AppOrgs): ThemeVariant => {
  switch (appOrg) {
    case 'nfk':
      return ThemeVariant.Nfk;
    case 'fram':
      return ThemeVariant.FRAM;
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

// @TODO: Make part of @AtB-as/theme

export type Themes = typeof themes;
export type Theme = Themes['light'];

export type InteractiveColor = keyof Theme['interactive'];
export type TransportColor = keyof Theme['transport'];

export const isInteractiveColor = (
  color?: string,
): color is InteractiveColor => {
  return !!color && color in themes.light.interactive;
};

/**
 * Static colors object structure:
 * {background: {...}, transport: {...}, status: {...}}
 */
type StaticColorsObj = Theme['static'];

/**
 * Names of static color categories:
 * 'background' | 'transport' | 'status'
 */
export type StaticColorType = keyof StaticColorsObj;

/**
 * Names of static colors, for a given static color type:
 * E.g. 'background_0' | 'background_1' | ... for StaticColor<'background'>
 */
export type StaticColorByType<Key extends StaticColorType> =
  keyof StaticColorsObj[Key];

/**
 * Flat object with every static color:
 * {background_0: ..., background_1: ..., valid: ...}
 */
export type FlatStaticColors = Flattened<StaticColorsObj>;

/**
 * Names of every static color:
 * 'background_0' | 'background_1' | 'valid' ...
 */
export type StaticColor = keyof FlatStaticColors;

export type FlatStaticColorObj = {
  light: Flattened<StaticColorsObj>;
  dark: Flattened<StaticColorsObj>;
};

export const flatStaticColors: FlatStaticColorObj = {
  light: flattenObject(themes.light.static) as FlatStaticColors,
  dark: flattenObject(themes.dark.static) as FlatStaticColors,
};

export const isStaticColor = (color?: string): color is StaticColor => {
  return !!color && color in flatStaticColors.light;
};

export const getStaticColor = (mode: Mode, color: StaticColor) => {
  return flatStaticColors[mode][color];
};
export const getTransportationColor = (
  mode: Mode,
  color: TransportColor,
  type?: 'primary' | 'secondary',
) => {
  return themes[mode].transport[color][type ?? 'primary'];
};

export const getStaticColorType = (color: StaticColor): StaticColorType => {
  return Object.keys(themes.light.static).find(
    (colorType) => color in themes.light.static[colorType as StaticColorType],
  ) as StaticColorType;
};

export const isStatusColor = (
  color?: string,
): color is StaticColorByType<'status'> => {
  return !!color && color in themes.light.static.status;
};
