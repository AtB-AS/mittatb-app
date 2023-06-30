import React, {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

type BottomSheetContentFunction = (close: () => void) => ReactNode;

type BottomSheetState = {
  open: (
    contentFunction: BottomSheetContentFunction,
    useBackdrop?: boolean,
  ) => void;
  isOpen: () => boolean;
  close: () => void;
  height: number;
  /** Use onOpenFocusRef to give a component accessibility focus when BottomSheet open. The component must be accessible! */
  onOpenFocusRef?: RefObject<any>;
  /** Optional ref to component which should be focused on sheet close */
  onCloseFocusRef?: RefObject<any>;
};

const BottomSheetContext = createContext<BottomSheetState | undefined>(
  undefined,
);

export const BottomSheetProvider: React.FC = ({children}) => {
  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const [isBackdropEnabled, setBackdropEnabled] = useState(true);
  const [contentFunction, setContentFunction] = useState<
    (close: () => void) => ReactNode
  >(() => () => null);

  const animatedOffset = useMemo(() => new Animated.Value(0), []);
  const onOpenFocusRef = useFocusOnLoad();
  const onCloseFocusRef = useRef(null);

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
      giveFocus(onCloseFocusRef);
    }
  };

  const open = (
    contentFunction: (close: () => void) => ReactNode,
    useBackdrop: boolean = true,
  ) => {
    setContentFunction(() => contentFunction);
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
          {contentFunction(close)}
        </AnimatedBottomSheet>
      </>
    ),
    [isOpen, close, animatedOffset, safeAreaBottom],
  );

  const state = {
    open,
    close,
    isOpen: () => isOpen,
    height,
    onOpenFocusRef,
    onCloseFocusRef,
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
