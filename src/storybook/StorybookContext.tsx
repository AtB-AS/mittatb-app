import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {default as StorybookApp} from '../../.storybook';
import {StatusBar, Text} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {SafeAreaView} from 'react-native-safe-area-context';

type StorybookContextState = {
  isEnabled: boolean;
  setEnabled: (value: boolean) => void;
};

const defaultState: StorybookContextState = {
  isEnabled: true, // Tip: Change this to true if implementing stories in Storybook locally  // flip
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
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <StatusBar translucent={true} backgroundColor="white" />
          <PressableOpacity onPress={() => setEnabled(false)}>
            <Text style={{marginLeft: 12, fontSize: 18, color: '#32a852'}}>
              {'<-- Back to app'}
            </Text>
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
