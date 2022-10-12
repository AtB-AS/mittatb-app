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
  ViewStyle,
} from 'react-native';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import Backdrop from '@atb/components/bottom-sheet/Backdrop';
import ClickableBackground from '@atb/components/bottom-sheet/ClickableBackground';
import AnimatedBottomSheet from '@atb/components/bottom-sheet/AnimatedBottomSheet';

type BottomSheetContentFunction = (
  close: () => void,
  /** Use focusRef to give a component accessibility focus when BottomSheet open. The component must be accessible! */
  focusRef: RefObject<any>,
) => ReactNode;

type BottomSheetState = {
  open: (
    contentFunction: BottomSheetContentFunction,
    /** Optional ref to component which should be focused on sheet close */
    closeRef?: RefObject<any>,
    useBackdrop?: boolean,
    style?: ViewStyle,
  ) => void;
};

const BottomSheetContext = createContext<BottomSheetState | undefined>(
  undefined,
);

const BottomSheetProvider: React.FC = ({children}) => {
  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const [isBackdropEnabled, setBackdropEnabled] = useState(true);
  const [style, setStyle] = useState({});
  const [contentFunction, setContentFunction] = useState<
    (close: () => void, focusRef: RefObject<any>) => ReactNode
  >(() => () => null);

  const animatedOffset = useMemo(() => new Animated.Value(0), []);
  const focusRef = useRef(null);
  const [closeRef, setCloseRef] = useState<RefObject<any> | undefined>();

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
    setStyle({});
    setBackdropEnabled(true);
    if (closeRef) {
      setTimeout(() => giveFocus(closeRef), 200);
    }
  };

  const open = (
    contentFunction: (close: () => void, focusRef: RefObject<any>) => ReactNode,
    closeRef?: RefObject<any>,
    useBackdrop: boolean = true,
    style: ViewStyle = {},
  ) => {
    setContentFunction(() => contentFunction);
    setCloseRef(closeRef);
    setBackdropEnabled(useBackdrop);
    setIsOpen(true);
    setStyle(style);
    setTimeout(() => giveFocus(focusRef), 300);
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
          style={style}
        >
          {contentFunction(close, focusRef)}
        </AnimatedBottomSheet>
      </>
    ),
    [isOpen, close, focusRef, animatedOffset, safeAreaBottom],
  );

  const state = {
    open,
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

export default BottomSheetProvider;
