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
  bottomSheetMapRef: React.RefObject<BottomSheet | null>;
};

const BottomSheetContext = createContext<BottomSheetState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const BottomSheetContextProvider = ({children}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetMapRef = useRef<BottomSheet>(null);

  const state = {
    isOpen,
    setIsOpen,
    bottomSheetMapRef,
  };

  return (
    <BottomSheetContext.Provider value={state}>
      <View
        style={{flex: 1}}
        accessibilityElementsHidden={isOpen}
        importantForAccessibility={isOpen ? 'no-hide-descendants' : 'yes'}
      >
        {children}
      </View>
    </BottomSheetContext.Provider>
  );
};

export function useBottomSheetContext() {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error(
      'useBottomSheetContext must be used within a BottomSheetContextProvider',
    );
  }
  return context;
}
