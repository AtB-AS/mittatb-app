import React, {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Animated,
  BackHandler,
  Easing,
  LayoutChangeEvent,
  View,
} from 'react-native';
import {useFocusOnLoad, giveFocus} from '@atb/utils/use-focus-on-load';
import {Backdrop} from './Backdrop';
import {ClickableBackground} from './ClickableBackground';
import {AnimatedBottomSheet} from './AnimatedBottomSheet';

type BottomSheetContentFunction = (
  close: () => void,
  /** Use onOpenFocusRef to give a component accessibility focus when BottomSheet open. The component must be accessible! */
  onOpenFocusRef: RefObject<any>,
) => ReactNode;

type BottomSheetState = {
  open: (
    contentFunction: BottomSheetContentFunction,
    /** Optional ref to component which should be focused on sheet close */
    onCloseFocusRef?: RefObject<any>,
    useBackdrop?: boolean,
  ) => void;
  isOpen: () => boolean;
  close: () => void;
  height: number;
};

const BottomSheetContext = createContext<BottomSheetState | undefined>(
  undefined,
);

export const BottomSheetProvider: React.FC = ({children}) => {
  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const [isBackdropEnabled, setBackdropEnabled] = useState(true);
  const [contentFunction, setContentFunction] = useState<
    (close: () => void, onOpenFocusRef: RefObject<any>) => ReactNode
  >(() => () => null);

  const animatedOffset = useMemo(() => new Animated.Value(0), []);
  const onOpenFocusRef = useFocusOnLoad();
  const [onCloseFocusRef, setOnCloseFocusRef] = useState<
    RefObject<any> | undefined
  >();

  useEffect(
    () => () =>
      Animated.timing(animatedOffset, {
        toValue: isOpen ? 0 : 1,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start(),
    [animatedOffset, isOpen],
  );

  const close = () => {
    setContentFunction(() => () => null);
    setIsOpen(false);
    if (onCloseFocusRef) {
      setTimeout(() => giveFocus(onCloseFocusRef), 200);
    }
  };

  const open = (
    contentFunction: (
      close: () => void,
      onOpenFocusRef: RefObject<any>,
    ) => ReactNode,
    onCloseFocusRef?: RefObject<any>,
    useBackdrop: boolean = true,
  ) => {
    setContentFunction(() => contentFunction);
    setOnCloseFocusRef(onCloseFocusRef);
    setBackdropEnabled(useBackdrop);
    setIsOpen(true);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isOpen) {
          close();
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [isOpen]);

  const [height, setHeight] = useState<number>(0);
  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height);
  };

  const bottomSheet = useMemo(
    () => (
      <>
        {isBackdropEnabled && (
          <>
            <Backdrop animatedOffset={animatedOffset} />
            <ClickableBackground
              isOpen={isOpen}
              close={close}
              height={height}
            />
          </>
        )}
        <AnimatedBottomSheet
          animatedOffset={animatedOffset}
          onLayout={onLayout}
        >
          {contentFunction(close, onOpenFocusRef)}
        </AnimatedBottomSheet>
      </>
    ),
    [isOpen, close, onOpenFocusRef, animatedOffset, safeAreaBottom],
  );

  const state = {
    open,
    close,
    isOpen: () => isOpen,
    height,
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
      {bottomSheet}
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
