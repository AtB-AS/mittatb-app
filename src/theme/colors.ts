import hexToRgba from 'hex-to-rgba';
import {StatusBarProps, TextStyle} from 'react-native';

const backgrounds = {
  light__level0: '#FFFFFF',
  light__level1: '#E7E8E9',
  light__level2: '#DBDDDE',
  light__level3: '#CFD2D3',

  dark__level0: '#000000',
  dark__level1: '#111416',
  dark__level2: '#191E21',
  dark__level3: '#1E2429',
};

const colors = {
  white: '#ffffff',
  black: '#000000',
  primary: {
    // grays
    gray_50: '#E7E8E9',
    gray_100: '#F5F5F6',
    gray_200: '#AFB3B7',
    gray_300: '#878E92',
    gray_400: '#5F686E',
    gray_500: '#37424A',
    gray_600: '#2C353B',
    gray_700: '#21282C',
    gray_800: '#161A1E',
    gray_900: '#101416',
    gray_950: '#1B1C1D',
    // greens
    green_100: '#E3E6B3',
    green_200: '#DADE99',
    green_300: '#C7CE66',
    green_400: '#B5BD33',
    green_500: '#A2AD00',
    green_600: '#828A00',
    green_700: '#616800',
    green_800: '#414500',
    green_900: '#313400',
  },
  secondary: {
    // cyan
    cyan_100: '#D4F3F6',
    cyan_200: '#C6EFF3',
    cyan_300: '#AAE6EC',
    cyan_400: '#8DDEE6',
    cyan_500: '#71D6E0',
    cyan_600: '#5AABB3',
    cyan_700: '#448086',
    cyan_800: '#2D565A',
    cyan_900: '#224043',
    // i got the blues
    blue_100: '#B3D8DE',
    blue_200: '#99CBD3',
    blue_300: '#66B0BE',
    blue_400: '#3396A8',
    blue_500: '#007C92',
    blue_600: '#006375',
    blue_700: '#004A58',
    blue_800: '#00323A',
    blue_900: '#00252C',

    brown: '#584528',

    orange: '#C75B12',

    yellow_100: '#F7F3B2',
    yellow_500: '#E4D700',

    red_100: '#E4B8C6',
    red_500: '#A51140',
  },
  text: {
    light: '#FFFFFF',
    dark: '#000000',
  },
};

export default colors;

const spacings = {
  xLarge: 24,
  large: 20,
  medium: 12,
  small: 8,
  xSmall: 4,
};

export type TextNames =
  | 'heroTitle'
  | 'pageTitle'
  | 'sectionHeadline'
  | 'itemHeadline'
  | 'paragraphHeadline'
  | 'body'
  | 'body__link'
  | 'lead'
  | 'label'
  | 'label__link';

export const textTypeStyles: {[key in TextNames]: TextStyle} = {
  heroTitle: {fontSize: 32, lineHeight: 40},
  pageTitle: {fontSize: 26, lineHeight: 32},
  sectionHeadline: {fontSize: 23, lineHeight: 28},
  itemHeadline: {fontSize: 20, lineHeight: 24},
  paragraphHeadline: {fontSize: 16, lineHeight: 20, fontWeight: '600'},
  body: {fontSize: 16, lineHeight: 20},
  body__link: {fontSize: 16, lineHeight: 20, textDecorationLine: 'underline'},
  lead: {fontSize: 14, lineHeight: 20},
  label: {fontSize: 12, lineHeight: 16},
  label__link: {fontSize: 12, lineHeight: 16, textDecorationLine: 'underline'},
};
export const iconSizes = {
  normal: 20,
  small: 10,
};
const tripLegDetail = {
  labelWidth: 80,
  decorationContainerWidth: 20,
  decorationLineEndWidth: 12,
  decorationLineWidth: 4,
};
const borderRadius = {
  circle: 20,
  regular: 8,
  small: 4,
} as const;

const borderWidth = {
  slim: 1,
  medium: 2,
};

export type Themes = {
  light: Theme;
  dark: Theme;
};
export type Mode = keyof Themes;

export type RadiusSizes = keyof typeof borderRadius;

export type TextColor = 'primary' | 'secondary' | 'disabled';

type TextColorType = 'dark' | 'light';

export type ContrastColor = {
  backgroundColor: string;
  textColorType: TextColorType;
};
const contrastColor = (
  backgroundColor: string = colors.white,
  textColorType: TextColorType = 'dark',
): ContrastColor => {
  return {backgroundColor, textColorType};
};
type StatusColor = {
  main: ContrastColor;
  bg: ContrastColor;
};
export interface Theme {
  statusBarStyle: StatusBarProps['barStyle'];
  spacings: typeof spacings;
  tripLegDetail: typeof tripLegDetail;
  colors: {
    background_0: ContrastColor;
    background_1: ContrastColor;
    background_2: ContrastColor;
    background_3: ContrastColor;
    primary_1: ContrastColor;
    primary_2: ContrastColor;
    primary_3: ContrastColor;
    primary_destructive: ContrastColor;
    secondary_1: ContrastColor;
    secondary_2: ContrastColor;
    secondary_3: ContrastColor;
    secondary_4: ContrastColor;
    transport_city: ContrastColor;
    transport_region: ContrastColor;
    transport_boat: ContrastColor;
    transport_train: ContrastColor;
    transport_airport: ContrastColor;
    transport_plane: ContrastColor;
    transport_other: ContrastColor;
  };
  status: {
    status_valid: StatusColor;
    status_info: StatusColor;
    status_warning: StatusColor;
    status_error: StatusColor;
  };
  background: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    header: string;
    destructive: string;
    warning: string;
    error: string;
    success: string;
    info: string;
    accent: string;
  };

  text: {
    colors: typeof defaultTextColors.light;
    color: typeof defaultTextColors;
  } & typeof textTypeStyles;

  border: {
    primary: string;
    secondary: string;
    focus: string;
    info: string;
    warning: string;
    error: string;
    success: string;
    radius: typeof borderRadius;
    width: typeof borderWidth;
  };
  icon: {
    size: typeof iconSizes;
  };
}
const defaultTextColors: {
  [key in TextColorType]: {[key in TextColor]: string};
} = {
  dark: {
    primary: colors.text.dark,
    secondary: hexToRgba(colors.text.dark, 0.6),
    disabled: hexToRgba(colors.text.dark, 0.2),
  },
  light: {
    primary: colors.text.light,
    secondary: hexToRgba(colors.text.light, 0.6),
    disabled: hexToRgba(colors.text.light, 0.2),
  },
};

export const themes: Themes = {
  light: {
    spacings: spacings,
    tripLegDetail: tripLegDetail,
    statusBarStyle: 'dark-content',
    background: {
      level0: backgrounds.light__level0,
      level1: backgrounds.light__level1,
      level2: backgrounds.light__level2,
      level3: backgrounds.light__level3,
      header: colors.secondary.cyan_500,
      destructive: colors.secondary.red_500,
      info: colors.secondary.cyan_100,
      warning: colors.secondary.yellow_100,
      error: colors.secondary.red_500,
      success: hexToRgba(colors.primary.green_500, 0.25),
      accent: colors.secondary.cyan_500,
    },

    colors: {
      background_0: contrastColor(colors.white, 'dark'),
      background_1: contrastColor(colors.primary.gray_50, 'dark'),
      background_2: contrastColor(colors.primary.gray_100, 'dark'),
      background_3: contrastColor(colors.primary.gray_200, 'dark'),
      primary_1: contrastColor(colors.primary.green_500, 'dark'),
      primary_2: contrastColor(colors.secondary.cyan_500, 'dark'),
      primary_3: contrastColor(colors.secondary.blue_500, 'light'),
      primary_destructive: contrastColor(colors.secondary.red_500, 'light'),
      secondary_1: contrastColor(),
      secondary_2: contrastColor(),
      secondary_3: contrastColor(),
      secondary_4: contrastColor(),

      transport_city: contrastColor(),
      transport_region: contrastColor(),
      transport_boat: contrastColor(),
      transport_train: contrastColor(),
      transport_airport: contrastColor(),
      transport_plane: contrastColor(),
      transport_other: contrastColor(),
    },
    status: {
      status_valid: {
        main: contrastColor(),
        bg: contrastColor(),
      },
      status_info: {
        main: contrastColor(),
        bg: contrastColor(),
      },
      status_warning: {
        main: contrastColor(),
        bg: contrastColor(),
      },
      status_error: {
        main: contrastColor(),
        bg: contrastColor(),
      },
    },
    text: {
      colors: defaultTextColors['light'],
      color: defaultTextColors,
      ...textTypeStyles,
    },
    border: {
      primary: colors.primary.gray_50,
      secondary: colors.text.dark,
      focus: colors.secondary.blue_500,
      info: colors.secondary.cyan_500,
      warning: colors.secondary.yellow_500,
      error: colors.secondary.red_500,
      success: colors.primary.green_500,
      radius: borderRadius,
      width: borderWidth,
    },
    icon: {
      size: iconSizes,
    },
  },
  dark: {
    spacings: spacings,
    tripLegDetail: tripLegDetail,
    statusBarStyle: 'light-content',
    background: {
      level0: backgrounds.dark__level0,
      level1: backgrounds.dark__level1,
      level2: backgrounds.dark__level2,
      level3: backgrounds.dark__level3,
      header: colors.secondary.blue_900,
      destructive: colors.secondary.red_500,
      warning: colors.primary.green_900,
      error: colors.secondary.red_500,
      success: hexToRgba(colors.primary.green_500, 0.25),
      info: colors.secondary.cyan_900,
      accent: backgrounds.dark__level1,
    },
    colors: {
      background_0: contrastColor(colors.white, 'dark'),
      background_1: contrastColor(colors.primary.gray_50, 'dark'),
      background_2: contrastColor(colors.primary.gray_100, 'dark'),
      background_3: contrastColor(colors.primary.gray_200, 'dark'),
      primary_1: contrastColor(),
      primary_2: contrastColor(),
      primary_3: contrastColor(),
      primary_destructive: contrastColor(),
      secondary_1: contrastColor(),
      secondary_2: contrastColor(),
      secondary_3: contrastColor(),
      secondary_4: contrastColor(),
      transport_city: contrastColor(),
      transport_region: contrastColor(),
      transport_boat: contrastColor(),
      transport_train: contrastColor(),
      transport_airport: contrastColor(),
      transport_plane: contrastColor(),
      transport_other: contrastColor(),
    },
    status: {
      status_valid: {
        main: contrastColor(),
        bg: contrastColor(),
      },
      status_info: {
        main: contrastColor(),
        bg: contrastColor(),
      },
      status_warning: {
        main: contrastColor(),
        bg: contrastColor(),
      },
      status_error: {
        main: contrastColor(),
        bg: contrastColor(),
      },
    },
    text: {
      colors: defaultTextColors['light'],
      color: defaultTextColors,
      ...textTypeStyles,
    },
    border: {
      primary: colors.text.light,
      secondary: colors.text.light,
      focus: colors.secondary.cyan_500,
      info: colors.secondary.cyan_800,
      warning: colors.primary.green_700,
      error: colors.secondary.red_500,
      success: colors.primary.green_500,
      radius: borderRadius,
      width: borderWidth,
    },
    icon: {
      size: iconSizes,
    },
  },
};
