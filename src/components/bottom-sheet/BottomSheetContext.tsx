import {giveFocus, useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TrueSheet} from '@lodev09/react-native-true-sheet';
import React, {
  createContext,
  ReactNode,
  Ref,
  useContext,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import {ThemeText} from '../text';

type BottomSheetContentFunction = () => ReactNode;

type BottomSheetState = {
  open: (
    contentFunction: BottomSheetContentFunction,
    useBackdrop?: boolean,
  ) => void;
  isOpen: () => boolean;
  close: () => void;
  height: number;
  /** Use onOpenFocusRef to give a component accessibility focus when BottomSheet open. The component must be accessible! */
  onOpenFocusRef: Ref<any>;
  /** Optional ref to component which should be focused on sheet close */
  onCloseFocusRef: Ref<any>;
};

const BottomSheetContext = createContext<BottomSheetState | undefined>(
  undefined,
);

export const BottomSheetProvider: React.FC = ({children}) => {
  const sheet = useRef<TrueSheet>(null);
  // Present the sheet ✅
  const present = async () => {
    await sheet.current?.present();
    console.log('horray! sheet has been presented 💩');
  };

  // Dismiss the sheet ✅
  const dismiss = async () => {
    await sheet.current?.dismiss();
    console.log('Bye bye 👋');
  };

  // const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const [contentFunction, setContentFunction] = useState<() => ReactNode>(
    () => () => null,
  );

  const onOpenFocusRef = useFocusOnLoad();
  const onCloseFocusRef = useRef(null);

  const close = () => {
    setContentFunction(() => () => null);
    giveFocus(onCloseFocusRef);
    dismiss();
  };

  const open = (
    contentFunction: () => ReactNode,
    useBackdrop: boolean = true,
  ) => {
    setContentFunction(() => contentFunction);
    present();
  };

  const [height, setHeight] = useState<number>(0);

  const state = {
    open,
    close,
    isOpen: () => false,
    height,
    onOpenFocusRef,
    onCloseFocusRef,
  };

  return (
    <BottomSheetContext.Provider value={state}>
      <View
        style={{flex: 1}}
        // accessibilityElementsHidden={isOpen}
        // importantForAccessibility={isOpen ? 'no-hide-descendants' : 'yes'}
      >
        {children}
      </View>
      <TrueSheet
        ref={sheet}
        sizes={['auto']}
        cornerRadius={24}
        dimmed={false}
        grabber={false}
      >
        {contentFunction()}
      </TrueSheet>
    </BottomSheetContext.Provider>
  );
};

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error(
      'useBottomSheet must be used within a BottomSheetContextProvider',
    );
  }
  return context;
}
