const colors = {
  primary: {
    green: '#A2AD00',
    gray: '#37424A',
  },
  secondary: {
    blue: '#008DA8',
    orange: '#C75B12',
    red: '#A51140',
  },
  general: {
    white: '#ffffff',
    black: '#000000',
    offblack: '#111416',
  },
};

export default colors;

const sizes = {
  pagePadding: 20,
};

export interface Theme {
  sizes: typeof sizes;
  background: {
    primary: string;
  };
  text: {
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
      primary: colors.general.white,
    },
    text: {
      primary: colors.general.black,
    },
  },
  dark: {
    sizes,
    background: {
      primary: colors.general.offblack,
    },
    text: {
      primary: colors.general.white,
    },
  },
};
