const backgrounds = {
  light__level0: '#FFFFFF',
  light__level1: '#F5F5F6',
  light__level2: '#EBECED',
  light__level3: '#E1E3E4',

  dark__level0: '#000000',
  dark__level1: '#111416',
  dark__level2: '#13171A',
  dark__level3: '#161A1E',
};

const colors = {
  primary: {
    green: '#A2AD00',
    green_700: '#616800',
    green_900: '#313400',
    gray: '#37424A',
  },
  secondary: {
    blue: '#008DA8',
    blue_500: '#007C92',
    orange: '#C75B12',
    yellow_100: '#F7F3B2',
    yellow_500: '#E4D700',
    red: '#A51140',
    cyan: '#71D6E0',
    cyan_100: '#D4F3F6',
    cyan_300: '#AAE6EC',
    cyan_500: '#71D6E0',
    cyan_700: '#448086',
    cyan_800: '#2d565a',
    cyan_900: '#224043',
    gray_Level2: '#EBECED',
    gray_500: '#37424A',
    brown: '#584528',
  },
  general: {
    white: '#ffffff',
    gray: '#D7D9DB',
    gray100: '#C3C6C9',
    gray200: '#AFB3B7',
    gray400: '#5F686E',
    gray_500: '#37424A',
    gray_700: '#21282C',
    black: '#000000',
    offblack: '#111416',
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
const fontSizes = {
  body: 16,
  lead: 14,
  label: 12,
};
const lineHeights = {
  body: 20,
  label: 16,
};
const borderRadius = {
  regular: 8,
  small: 4,
};
type Button = {
  bg: string;
  color: string;
};
type Mode = 'dark' | 'light';

export type Themes = {
  light: Theme;
  dark: Theme;
};
export interface Theme {
  mode: Mode;
  spacings: typeof spacings;
  background: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    header: string;
    modal_Level2: string;
    destructive: string;
    warning: string;
    info: string;
    accent: string;
  };
  text: {
    colors: {
      primary: string;
      destructive: string;
      faded: string;
      focus: string;
    };
    lineHeight: typeof lineHeights;
    sizes: typeof fontSizes;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    info: string;
    warning: string;
    borderRadius: typeof borderRadius;
  };
  button: {
    primary: Button;
    primary2: Button;
    primary3: Button;
    secondaryStroke: Button;
    secondary: Button;
  };
}

export const themes: Themes = {
  light: {
    mode: 'light',
    spacings: spacings,
    background: {
      level0: backgrounds.light__level0,
      level1: backgrounds.light__level1,
      level2: backgrounds.light__level2,
      level3: backgrounds.light__level3,
      header: colors.secondary.cyan_500,
      modal_Level2: colors.secondary.gray_Level2,
      destructive: colors.secondary.red,
      info: colors.secondary.cyan_100,
      warning: colors.secondary.yellow_100,
      accent: colors.secondary.cyan,
    },
    text: {
      colors: {
        primary: colors.general.black,
        destructive: colors.general.white,
        faded: colors.general.gray400,
        focus: colors.secondary.blue_500,
      },
      lineHeight: lineHeights,
      sizes: fontSizes,
    },
    border: {
      primary: colors.primary.gray,
      secondary: colors.general.black,
      focus: colors.secondary.blue_500,
      info: colors.secondary.cyan_500,
      warning: colors.secondary.yellow_500,
      borderRadius: borderRadius,
    },
    button: {
      primary: {bg: colors.secondary.cyan_500, color: colors.general.black},
      primary2: {bg: colors.general.gray_500, color: colors.general.white},
      primary3: {bg: colors.general.gray200, color: colors.general.black},
      secondaryStroke: {bg: colors.general.white, color: colors.general.black},
      secondary: {bg: colors.secondary.blue_500, color: colors.general.white},
    },
  },
  dark: {
    mode: 'dark',
    spacings: spacings,
    background: {
      level0: backgrounds.dark__level0,
      level1: backgrounds.dark__level1,
      level2: backgrounds.dark__level2,
      level3: backgrounds.dark__level3,
      header: backgrounds.dark__level1,
      modal_Level2: backgrounds.dark__level2,
      destructive: colors.secondary.red,
      warning: colors.primary.green_900,
      info: colors.secondary.cyan_900,
      accent: backgrounds.dark__level1,
    },

    text: {
      colors: {
        primary: colors.general.white,
        destructive: colors.general.white,
        faded: colors.general.gray100,
        focus: colors.secondary.cyan_500,
      },
      sizes: fontSizes,
      lineHeight: lineHeights,
    },
    border: {
      primary: colors.general.white,
      secondary: colors.general.white,
      focus: colors.secondary.cyan_500,
      info: colors.secondary.cyan_800,
      warning: colors.primary.green_700,
      borderRadius: borderRadius,
    },
    button: {
      primary: {bg: colors.secondary.blue_500, color: colors.general.white},
      primary2: {bg: colors.general.gray_500, color: colors.general.white},
      primary3: {bg: colors.general.gray_700, color: colors.general.white},
      secondaryStroke: {bg: colors.general.black, color: colors.general.white},
      secondary: {bg: colors.secondary.blue_500, color: colors.general.white},
    },
  },
};
