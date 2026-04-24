import type {Preview} from '@storybook/react';
import {AppearanceSelection, ThemeContext} from '../src/theme/ThemeContext';
import {Themes, themes} from '../src/theme/colors';

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
      const themeName: keyof Themes = args.theme ?? 'light';
      return (
        <ThemeContext.Provider
          value={{
            theme: themes[themeName],
            themeName,
            appearanceSelection: AppearanceSelection.SYSTEM,
            setAppearanceSelection: () => {},
            androidSystemFont: false,
            setAndroidSystemFont: () => {},
          }}
        >
          <Story />
        </ThemeContext.Provider>
      );
    },
  ],
};

export default preview;
