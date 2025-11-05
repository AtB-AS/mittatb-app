import React, {createContext, Dispatch, useContext, useState} from 'react';
import {View} from 'react-native';

type BottomSheetState = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const BottomSheetV2Context = createContext<BottomSheetState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const BottomSheetV2ContextProvider = ({children}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const state = {
    isOpen,
    setIsOpen,
  };

  return (
    <BottomSheetV2Context.Provider value={state}>
      <View
        style={{flex: 1}}
        accessibilityElementsHidden={isOpen}
        importantForAccessibility={isOpen ? 'no-hide-descendants' : 'yes'}
      >
        {children}
      </View>
    </BottomSheetV2Context.Provider>
  );
};

export function useBottomSheetV2Context() {
  const context = useContext(BottomSheetV2Context);
  if (context === undefined) {
    throw new Error(
      'useBottomSheetV2Context must be used within a BottomSheetV2ContextProvider',
    );
  }
  return context;
}
