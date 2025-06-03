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
import {
  AnalyticsEventContext,
  getPosthogClientGlobal,
} from '@atb/modules/analytics';
import Bugsnag from '@bugsnag/react-native';

type BottomSheetContentFunction = () => ReactNode;

type BottomSheetState = {
  open: (
    contentFunction: BottomSheetContentFunction,
    /** Ref to component which should be focused on sheet close */
    onCloseFocusRef: RefObject<any>,
    useBackdrop?: boolean,
    /**
     * Make sure if you use this prop in a tabscreen, that you handle navigating away by closing the bottomsheet.
     * Example in Map_RootScreenV2 useEffect
     */
    tabBarHeight?: number,
  ) => void;
  isOpen: () => boolean;
  close: () => void;
  height: number;
  /** Use onOpenFocusRef to give a component accessibility focus when BottomSheet open. The component must be accessible! */
  onOpenFocusRef: Ref<any>;
  /** This is implemented here aditionally to the useAnalyticsContext becuase the analytics context is wrapped around the
   * NavigationContainer at the lowest levet to be able to use auto-capture on navigation events. This prevents us from using the
   * analytics context in bottomsheets because the bottomsheet context it wrapped at a higher level in the stack and out of scope of the analytics context */
  logEvent: (
    context: AnalyticsEventContext,
    event: string,
    properties?: {[key: string]: any},
  ) => void;
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
  const [tabBarHeight, setTabBarHeight] = useState<number>();

  const onOpenFocusRef = useFocusOnLoad();
  const refToFocusOnClose = useRef<RefObject<any>>(undefined);

  const logEvent = useCallback(
    (
      context: AnalyticsEventContext,
      event: string,
      properties?: {[key: string]: any},
    ) => {
      const client = getPosthogClientGlobal();
      if (!client) {
        Bugsnag.leaveBreadcrumb(
          `Event '${event}' could not be logged in PostHog. PostHog is undefined.`,
        );
        console.warn(
          `Event '${event}' could not be logged in PostHog. PostHog is undefined.`,
        );

        return;
      }

      client.capture(`${context}: ${event}`, properties);
    },
    [],
  );

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
    logEvent,
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
        bottomOffset={tabBarHeight}
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
  bottomOffset,
}: {
  isBackdropEnabled: boolean;
  isOpen: boolean;
  close: () => void;
  height: number;
  setHeight: (height: number) => void;
  contentFunction: () => ReactNode;
  bottomOffset?: number;
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
    [animatedOffset, isOpen],
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
        bottomOffset={bottomOffset}
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
