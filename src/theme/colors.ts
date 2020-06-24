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
    red: '#A51140',
    cyan: '#71D6E0',
    gray_Level2: '#EBECED',
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

const sizes = {
  pagePadding: 12,
};

export interface Theme {
  sizes: typeof sizes;
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
    primary: string;
    destructive: string;
    faded: string;
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
    sizes,
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
      primary: colors.general.black,
      destructive: colors.general.white,
      faded: colors.general.gray400,
    },
    border: {
      primary: colors.primary.gray,
    },
  },
  dark: {
    sizes,
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
      primary: colors.general.white,
      destructive: colors.general.white,
      faded: colors.general.gray400,
    },
    border: {
      primary: colors.primary.gray,
    },
  },
};
