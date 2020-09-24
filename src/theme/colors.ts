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
    gray: '#37424A',
  },
  secondary: {
    blue: '#008DA8',
    orange: '#C75B12',
    yellow_100: '#F7F3B2',
    yellow_500: '#E4D700',
    red: '#A51140',
    cyan: '#71D6E0',
    cyan_100: '#D4F3F6',
    cyan_300: '#AAE6EC',
    cyan_500: '#71D6E0',
    blue_500: '#007C92',
    gray_Level2: '#EBECED',
    gray_500: '#37424A',
  },
  general: {
    white: '#ffffff',
    gray: '#D7D9DB',
    gray200: '#AFB3B7',
    gray400: '#5F686E',
    black: '#000000',
    offblack: '#111416',
  },
};

export default colors;

const spacings = {
  large: 20,
  medium: 12,
  small: 8,
  xSmall: 4
 
};
const fontSizes = {
    body: 16,
    lead: 14,
    label: 12
}
export interface Theme {
  spacings: typeof spacings;
  background: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    modal_Level2: string;
    destructive: string;
    accent: string;
  };
  text: {
    colors: {
      primary: string;
      destructive: string;
      faded: string;
    }
    sizes: typeof fontSizes,
  };
  border: {
    primary: string;
  };
}

export type Themes = {
  light: Theme;
  dark: Theme;
};

export const themes: Themes = {
  light: {
    spacings: spacings,
    background: {
      level0: backgrounds.light__level0,
      level1: backgrounds.light__level1,
      level2: backgrounds.light__level2,
      level3: backgrounds.light__level3,
      modal_Level2: colors.secondary.gray_Level2,
      destructive: colors.secondary.red,
      accent: colors.secondary.cyan,
    },
    text: {
      colors: {
        primary: colors.general.black,
        destructive: colors.general.white,
        faded: colors.general.gray400,
      },
      sizes: fontSizes
    },
    border: {
      primary: colors.primary.gray,
    },
  },
  dark: {
    spacings: spacings,
    background: {
      level0: colors.general.black,
      level1: colors.general.offblack,
      level2: colors.general.gray,
      level3: colors.general.gray,
      modal_Level2: colors.secondary.gray_Level2,
      destructive: colors.secondary.red,
      accent: colors.secondary.cyan,
    },
    text: {
      colors: {
        primary: colors.general.white,
        destructive: colors.general.white,
        faded: colors.general.gray400,
      },
      sizes: fontSizes
    },
    border: {
      primary: colors.primary.gray,
    },
  },
};
