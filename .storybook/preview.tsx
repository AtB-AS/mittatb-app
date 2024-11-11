import type {Preview} from '@storybook/react';
import {ThemeContext} from '../src/theme/ThemeContext';
import {themes} from '../src/theme/colors';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        // color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story, {args}) => {
      const themeName = args.theme ?? 'light';
      return (
        <ThemeContext.Provider value={{theme: themes[themeName], themeName}}>
          <Story />
        </ThemeContext.Provider>
      );
    },
  ],
  tags: ['autodocs'],
};

export default preview;
