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
    lightGray: 'rgba(0, 0, 0, 0.6)',
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
    accent: string;
  };
  text: {
    primary: string;
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
      primary: colors.general.white,
      accent: colors.primary.green,
    },
    text: {
      primary: colors.general.black,
      faded: colors.general.lightGray,
    },
    border: {
      primary: colors.primary.gray,
    },
  },
  dark: {
    sizes,
    background: {
      primary: colors.general.offblack,
      accent: colors.primary.green,
    },
    text: {
      primary: colors.general.white,
      faded: colors.general.lightGray,
    },
    border: {
      primary: colors.primary.gray,
    },
  },
};
