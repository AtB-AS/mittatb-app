import React, {
  createContext,
  ReactNode,
  Ref,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  LayoutChangeEvent,
  View,
} from 'react-native';
import {giveFocus, useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Backdrop} from './Backdrop';
import {ClickableBackground} from './ClickableBackground';
import {AnimatedBottomSheet} from './AnimatedBottomSheet';

type BottomSheetContentFunction = () => ReactNode;

type BottomSheetState = {
  open: (
    contentFunction: BottomSheetContentFunction,
    /** Ref to component which should be focused on sheet close */
    onCloseFocusRef: RefObject<any>,
    useBackdrop?: boolean,
    tabBarHeight?: number,
  ) => void;
  isOpen: () => boolean;
  close: () => void;
  height: number;
  /** Use onOpenFocusRef to give a component accessibility focus when BottomSheet open. The component must be accessible! */
  onOpenFocusRef: Ref<any>;
};

const BottomSheetContext = createContext<BottomSheetState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const BottomSheetContextProvider = ({children}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBackdropEnabled, setBackdropEnabled] = useState(true);
  const [contentFunction, setContentFunction] = useState<() => ReactNode>(
    () => () => null,
  );
  const [tabBarHeight, setTabBarHeight] = useState<number | undefined>(
    undefined,
  );

  const onOpenFocusRef = useFocusOnLoad();
  const refToFocusOnClose = useRef<RefObject<any>>(undefined);

  const close = useCallback(() => {
    setContentFunction(() => () => null);
    setTabBarHeight(undefined);
    setIsOpen(false);
    if (refToFocusOnClose.current) {
      giveFocus(refToFocusOnClose.current);
      refToFocusOnClose.current = undefined;
    }
  }, []);

  const open = useCallback(
    (
      contentFunction: () => ReactNode,
      onCloseFocusRef: RefObject<any>,
      useBackdrop: boolean = true,
      tabBarHeight?: number,
    ) => {
      setContentFunction(() => contentFunction);
      setBackdropEnabled(useBackdrop);
      setIsOpen(true);
      refToFocusOnClose.current = onCloseFocusRef;
      setTabBarHeight(tabBarHeight);
    },
    [],
  );

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
  }, [isOpen, close]);

  const [height, setHeight] = useState<number>(0);
  const state = {
    open,
    close,
    isOpen: useCallback(() => isOpen, [isOpen]),
    height,
    onOpenFocusRef,
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
      <BottomSheetOnBackDrop
        isBackdropEnabled={isBackdropEnabled}
        isOpen={isOpen}
        close={close}
        height={height}
        setHeight={setHeight}
        contentFunction={contentFunction}
        tabBarHeight={tabBarHeight}
      />
    </BottomSheetContext.Provider>
  );
};

const BottomSheetOnBackDrop = ({
  isBackdropEnabled,
  isOpen,
  close,
  height,
  setHeight,
  contentFunction,
  tabBarHeight,
}: {
  isBackdropEnabled: boolean;
  isOpen: boolean;
  close: () => void;
  height: number;
  setHeight: (height: number) => void;
  contentFunction: () => ReactNode;
  tabBarHeight?: number;
}) => {
  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height);
  };

  const animatedOffset = useMemo(() => new Animated.Value(0), []);
  useEffect(
    () => () =>
      Animated.timing(animatedOffset, {
        toValue: isOpen ? 0 : 1,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start(),
    [animatedOffset, isOpen, tabBarHeight],
  );

  return (
    <>
      {isBackdropEnabled && (
        <>
          <Backdrop animatedOffset={animatedOffset} />
          <ClickableBackground isOpen={isOpen} close={close} height={height} />
        </>
      )}
      <AnimatedBottomSheet
        animatedOffset={animatedOffset}
        onLayout={onLayout}
        tabBarHeight={tabBarHeight}
      >
        {contentFunction()}
      </AnimatedBottomSheet>
    </>
  );
};

export function useBottomSheetContext() {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error(
      'useBottomSheet must be used within a BottomSheetContextProvider',
    );
  }
  return context;
}
