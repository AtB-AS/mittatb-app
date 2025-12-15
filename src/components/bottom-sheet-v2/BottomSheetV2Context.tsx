import BottomSheet from '@gorhom/bottom-sheet';
import React, {
  createContext,
  Dispatch,
  useContext,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';

type BottomSheetState = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  bottomSheetGorRef: React.RefObject<BottomSheet | null>;
};

const BottomSheetV2Context = createContext<BottomSheetState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const BottomSheetV2ContextProvider = ({children}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetGorRef = useRef<BottomSheet>(null);

  const state = {
    isOpen,
    setIsOpen,
    bottomSheetGorRef,
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
