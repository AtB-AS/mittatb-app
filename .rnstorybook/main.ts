import type {StorybookConfig} from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../src/modules/storybook/stories/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
  // @ts-ignore
  core: {
    disableTelemetry: true,
  },
};

export default main;
