import AsyncStorage from '@react-native-async-storage/async-storage';
import {view} from './storybook.requires';
import {theme} from '@storybook/react-native';

const StorybookUIRoot = view.getStorybookUI({
  theme,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
