import {StatusBarProps, TextStyle} from 'react-native';

const backgrounds = {
  light__level0: '#FFFFFF',
  light__level1: '#F5F5F6',
  light__level2: '#EBECED',
  light__level3: '#E1E3E4',

  dark__level0: '#000000',
  dark__level1: '#111416',
  dark__level2: '#191E21',
  dark__level3: '#1E2429',
};

const colors = {
  primary: {
    // grays
    gray_100: '#C3C6C9',
    gray_200: '#AFB3B7',
    gray_300: '#878E92',
    gray_400: '#5F686E',
    gray_500: '#37424A',
    gray_600: '#2C353B',
    gray_700: '#21282C',
    gray_800: '#161A1E',
    gray_900: '#101416',
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
    white: '#FFFFFF',
    black: '#000000',
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

const sizes = {
  touchable: 44,
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

export type TextColors = 'primary' | 'destructive' | 'faded' | 'focus';

export const textTypes: {[key in TextNames]: TextStyle} = {
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

const borderRadius = {
  circle: 20,
  regular: 8,
  small: 4,
};
const borderWidth = {
  slim: 1,
  medium: 2,
};
type Button = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};
export type Themes = {
  light: Theme;
  dark: Theme;
};
export type Mode = keyof Themes;

export interface Theme {
  statusBarStyle: StatusBarProps['barStyle'];
  spacings: typeof spacings;
  sizes: typeof sizes;
  background: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    header: string;
    destructive: string;
    warning: string;
    error: string;
    info: string;
    accent: string;
  };
  text: {
    colors: {[key in TextColors]: string};
  } & typeof textTypes;
  border: {
    primary: string;
    secondary: string;
    focus: string;
    info: string;
    warning: string;
    error: string;
    radius: typeof borderRadius;
    width: typeof borderWidth;
  };
  button: {
    primary: Button;
    primary2: Button;
    primary3: Button;
    secondary: Button;
    tertiary: Button;
    destructive: Button;
  };
}

export const themes: Themes = {
  light: {
    spacings: spacings,
    sizes: sizes,
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
      error: colors.secondary.red_100,
      accent: colors.secondary.cyan_500,
    },
    text: {
      colors: {
        primary: colors.text.black,
        destructive: colors.text.white,
        faded: colors.primary.gray_400,
        focus: colors.secondary.blue_500,
      },
      ...textTypes,
    },
    border: {
      primary: colors.primary.gray_100,
      secondary: colors.text.black,
      focus: colors.secondary.blue_500,
      info: colors.secondary.cyan_500,
      warning: colors.secondary.yellow_500,
      error: colors.secondary.red_500,
      radius: borderRadius,
      width: borderWidth,
    },
    button: {
      primary: {
        backgroundColor: colors.secondary.cyan_500,
        textColor: colors.text.black,
        borderColor: colors.secondary.cyan_500,
      },
      primary2: {
        backgroundColor: colors.primary.gray_500,
        textColor: colors.text.white,
        borderColor: colors.primary.gray_500,
      },
      primary3: {
        backgroundColor: colors.primary.gray_100,
        textColor: colors.text.black,
        borderColor: colors.primary.gray_100,
      },
      secondary: {
        backgroundColor: 'transparent',
        textColor: colors.text.black,
        borderColor: colors.primary.gray_500,
      },
      tertiary: {
        backgroundColor: 'transparent',
        textColor: colors.text.black,
        borderColor: 'transparent',
      },
      destructive: {
        backgroundColor: colors.secondary.red_500,
        textColor: colors.text.white,
        borderColor: colors.secondary.red_500,
      },
    },
  },
  dark: {
    spacings: spacings,
    sizes: sizes,
    statusBarStyle: 'light-content',
    background: {
      level0: backgrounds.dark__level0,
      level1: backgrounds.dark__level1,
      level2: backgrounds.dark__level2,
      level3: backgrounds.dark__level3,
      header: colors.secondary.blue_900,
      destructive: colors.secondary.red_500,
      warning: colors.primary.green_900,
      error: colors.secondary.red_100,
      info: colors.secondary.cyan_900,
      accent: backgrounds.dark__level1,
    },

    text: {
      colors: {
        primary: colors.text.white,
        destructive: colors.text.white,
        faded: colors.primary.gray_100,
        focus: colors.secondary.cyan_500,
      },
      ...textTypes,
    },
    border: {
      primary: colors.text.white,
      secondary: colors.text.white,
      focus: colors.secondary.cyan_500,
      info: colors.secondary.cyan_800,
      warning: colors.primary.green_700,
      error: colors.secondary.red_500,
      radius: borderRadius,
      width: borderWidth,
    },
    button: {
      primary: {
        backgroundColor: colors.secondary.blue_500,
        textColor: colors.text.white,
        borderColor: colors.secondary.blue_500,
      },
      primary2: {
        backgroundColor: colors.primary.gray_100,
        textColor: colors.text.black,
        borderColor: colors.primary.gray_100,
      },
      primary3: {
        backgroundColor: colors.primary.gray_500,
        textColor: colors.text.white,
        borderColor: colors.primary.gray_500,
      },
      secondary: {
        backgroundColor: 'transparent',
        textColor: colors.text.white,
        borderColor: colors.primary.gray_100,
      },
      tertiary: {
        backgroundColor: 'transparent',
        textColor: colors.text.white,
        borderColor: 'transparent',
      },
      destructive: {
        backgroundColor: colors.secondary.red_500,
        textColor: colors.text.white,
        borderColor: colors.secondary.red_500,
      },
    },
  },
};
