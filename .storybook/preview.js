import {ThemeContext} from '@atb/theme/ThemeContext';
import {themes} from '@atb/theme/colors';
import React from 'react';

export const parameters = {
  controls: {
    matchers: {
      // color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story, {args}) => {
    const themeName = args.theme ?? 'light';
    return (
      <ThemeContext.Provider value={{theme: themes[themeName], themeName}}>
        <Story />
      </ThemeContext.Provider>
    );
  },
];
