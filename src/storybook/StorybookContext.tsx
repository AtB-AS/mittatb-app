import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {default as StorybookApp} from '../../.storybook';
import {StatusBar} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowLeft} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';

type StorybookContextState = {
  isEnabled: boolean;
  setEnabled: (value: boolean) => void;
};

const defaultState: StorybookContextState = {
  isEnabled: false, // Tip: Change this to true if implementing stories in Storybook locally
  setEnabled: () => {},
};

const StorybookContext = createContext<StorybookContextState>(defaultState);

export const StorybookContextProvider = ({children}: {children: ReactNode}) => {
  const [isEnabled, setEnabled] = useState(defaultState.isEnabled);

  useEffect(() => {
    if (isEnabled) {
      RNBootSplash.hide({fade: true});
    }
  }, [isEnabled]);

  return (
    <StorybookContext.Provider value={{isEnabled, setEnabled}}>
      {isEnabled ? (
        <SafeAreaView style={{flex: 1}}>
          <StatusBar translucent={true} />
          <PressableOpacity
            onPress={() => setEnabled(false)}
            style={{flexDirection: 'row', padding: 8, alignItems: 'center'}}
          >
            <ThemeIcon svg={ArrowLeft} />
            <ThemeText style={{marginLeft: 4}}>Back to app</ThemeText>
          </PressableOpacity>
          <StorybookApp />
        </SafeAreaView>
      ) : (
        children
      )}
    </StorybookContext.Provider>
  );
};

export function useStorybookContext() {
  const context = useContext(StorybookContext);
  if (context === undefined) {
    throw new Error(
      'useStorybookContextState must be used within a StorybookContextProvider',
    );
  }
  return context;
}
